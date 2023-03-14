from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from abc import ABC, abstractmethod
import os, random

if __name__ == '__main__':
  raise ImportError('The file \'hw6lib.py\' can only be imported.')

class OracleLR(ABC):
  @abstractmethod
  def Encrypt(self, M0, M1):
    # The arguments 'M0' and 'M1' are the two candidate messages.
    # It is supposed to return a fresh ciphertext of either 'M0' or 'M1'.
    raise NotImplementedError

class AdversaryIndCpa(ABC):
  @abstractmethod
  def Decide(self, oracle):
    # The argument 'oracle' must implement 'OracleLR'.
    # This method can only be called once on each instance.
    # It returns a bit, which is the output of this adversary.
    raise NotImplementedError

class SKE(ABC):
  @abstractmethod
  def Enc(self, M):
    raise NotImplementedError

  @abstractmethod
  def Dec(self, C):
    raise NotImplementedError

class SimpleSKE(SKE):
  def __init__(self):
    # Do NOT cheat by looking at this member!
    self._K = os.urandom(16)

  def Enc(self, M):
    if not (isinstance(M, bytes) or isinstance(M, bytearray)):
      raise ValueError('SimpleSKE.Enc: The argument \'M\' is not bytes/bytearray.')
    if len(M) != 16:
      raise ValueError('SimpleSKE.Enc: The argument \'M\' is not 16-byte long.')
    cipher = Cipher(algorithms.AES(self._K),
      modes.ECB(),
      backend=default_backend())
    enc = cipher.encryptor()
    IV = os.urandom(16)
    OTP = enc.update(IV) + enc.finalize()
    C = IV + bytes(a ^ b for (a, b) in zip(OTP, M))
    return C

  def Dec(self, C):
    if not (isinstance(C, bytes) or isinstance(C, bytearray)):
      raise ValueError('SimpleSKE.Dec: The argument \'C\' is not bytes/bytearray.')
    if len(C) != 32:
      raise ValueError('SimpleSKE.Dec: The argument \'C\' is not 32-byte long.')
    cipher = Cipher(algorithms.AES(self._K),
      modes.ECB(),
      backend=default_backend())
    enc = cipher.encryptor()
    IV = C[0:16]
    OTP = enc.update(IV) + enc.finalize()
    M = bytes(a ^ b for (a, b) in zip(OTP, C[16:32]))
    return M

class AppendZeroSKE(SKE):
  def __init__(self):
    self._SimpleSKE = SimpleSKE()

  def Enc(self, M):
    if not (isinstance(M, bytes) or isinstance(M, bytearray)):
      raise ValueError('AppendZeroSKE.Enc: The argument \'M\' is not bytes/bytearray.')
    if len(M) != 16:
      raise ValueError('AppendZeroSKE.Enc: The argument \'M\' is not 16-byte long.')
    return self._SimpleSKE.Enc(M) + b'\0'

  def Dec(self, C):
    if not (isinstance(C, bytes) or isinstance(C, bytearray)):
      raise ValueError('AppendZeroSKE.Dec: The argument \'C\' is not bytes/bytearray.')
    if len(C) != 33:
      raise ValueError('AppendZeroSKE.Dec: The argument \'C\' is not 33-byte long.')
    if C[32] != 0:
      raise ValueError('AppendZeroSKE.Dec: The argument \'C\' does not end with a zero byte.')
    return self._SimpleSKE.Dec(C[0:32])

def PrepareReductionAppendZeroSimple(b, advantage):
  b = int(b)
  if not (b == 0 or b == 1):
    raise ValueError('PrepareReductionAppendZeroSimple: b (challenge bit) is invalid.')
  advantage = float(advantage)
  if not (0 <= advantage and advantage <= 1):
    raise ValueError('PrepareReductionAppendZeroSimple: advantage is invalid.')
  append0SKE = AppendZeroSKE()
  # Create LRb(SimpleSKE) to be given to the reduction algorithm.
  class MysteriousOracleLR(OracleLR):
    def Encrypt(self, M0, M1):
      if len(M0) != len(M1):
        raise ValueError('MysteriousOracleLR.Encrypt: The arguments \'M0\' and \'M1\' have different lengths.')
      return append0SKE._SimpleSKE.Enc(M0 if b == 0 else M1)
  # Create an underlying adversary
  # against 'AppendZeroSKE' with the desired advantage.
  class UnderlyingAdversaryAgainstAppendZeroSKE(AdversaryIndCpa):
    def __init__(self):
      self._used = False

    def Decide(self, oracle):
      # The argument 'oracle' comes from the reduction algorithm.
      if self._used:
        raise ValueError('UnderlyingAdversaryAgainstAppendZeroSKE.Decide: This method cannot be called twice.')
      self._used = True
      if not isinstance(oracle, OracleLR):
        raise ValueError('UnderlyingAdversaryAgainstAppendZeroSKE.Decide: The argument \'oracle\' does not implement \'OracleLR\'.')
      # This loop checks whether the reduction
      # correctly implements 'oracle'.
      trials = random.randint(8, 16)
      hits1 = 0
      for i in range(trials):
        # Create two messages.
        M0 = os.urandom(16)
        M1 = M0
        while M0 == M1:
          M1 = os.urandom(16)
        # Request a ciphertext from the reduction algorithm.
        C = oracle.Encrypt(M0, M1)
        # Check whether 'C' is a ciphertext under 'AppendZeroSKE'.
        if ((not (isinstance(C, bytes) or isinstance(C, bytearray)))
            or len(C) != 33 or C[32] != 0):
          raise ValueError('UnderlyingAdversaryAgainstAppendZeroSKE: I received something that is not a ciphertext of \'AppendZeroSKE\'.')
        # This adversary cheats using the knowledge of 'K'.
        M = append0SKE.Dec(C)
        # In case someone does a hybrid / reverse-order reduction,
        # we still try to function as usual.
        if M == M1:
          hits1 += 1
      # Produce the desired advantage if all checks pass.
      if random.random() <= advantage:
        return 1 if hits1 > trials / 2 else 0
      return random.randint(0, 1)
  # Back in 'PrepareReductionAppendZeroSimple'.
  return MysteriousOracleLR(), UnderlyingAdversaryAgainstAppendZeroSKE

def TestReductionAppendZeroSimple(reduction, advantage, trials):
  trials = int(trials)
  if trials < 8 or trials > 65536:
    raise ValueError('The argument \'trials\' must be between 8 and 65536 (inclusive).')
  print('TestReductionAppendZeroSimple(%s):' % reduction.__qualname__)
  print('             underlying advantage = %f' % advantage)
  print('                 number of trials = %d' % trials)
  counts = [0, 0]
  for b in range(2):
    for i in range(trials):
      oracle, underlying = PrepareReductionAppendZeroSimple(b, advantage)
      c = reduction(underlying).Decide(oracle)
      if c != 0 and c != 1:
        raise ValueError('TestReductionAppendZeroSimple: reduction.Decide did not return a bit.')
      counts[b] += int(c)
  print('    estimated reduction advantage = %f' % (abs(counts[0] - counts[1]) / trials))
  print('')

class TwiceSKE(SKE):
  def __init__(self):
    self._SimpleSKE = SimpleSKE()

  def Enc(self, M):
    if not (isinstance(M, bytes) or isinstance(M, bytearray)):
      raise ValueError('TwiceSKE.Enc: The argument \'M\' is not bytes/bytearray.')
    if len(M) != 16:
      raise ValueError('TwiceSKE.Enc: The argument \'M\' is not 16-byte long.')
    c1 = self._SimpleSKE.Enc(M)
    c2 = self._SimpleSKE.Enc(M)
    return c1 + c2

  def Dec(self, C):
    if not (isinstance(C, bytes) or isinstance(C, bytearray)):
      raise ValueError('TwiceSKE.Dec: The argument \'C\' is not bytes/bytearray.')
    if len(C) != 64:
      raise ValueError('TwiceSKE.Dec: The argument \'C\' is not 64-byte long.')
    return self._SimpleSKE.Enc(C[0:32])

def PrepareReductionTwiceSimple(b, advantage):
  b = int(b)
  if not (b == 0 or b == 1):
    raise ValueError('PrepareReductionTwiceSimple: b (challenge bit) is invalid.')
  advantage = float(advantage)
  if not (0 <= advantage and advantage <= 1):
    raise ValueError('PrepareReductionTwiceSimple: advantage is invalid.')
  twiceSKE = TwiceSKE()
  # Create LRb(SimpleSKE) to be given to the reduction algorithm.
  class MysteriousOracleLR(OracleLR):
    def Encrypt(self, M0, M1):
      if len(M0) != len(M1):
        raise ValueError('MysteriousOracleLR.Encrypt: The arguments \'M0\' and \'M1\' have different lengths.')
      return twiceSKE._SimpleSKE.Enc(M0 if b == 0 else M1)
  # Create an underlying adversary
  # against 'TwiceSKE' with the desired advantage.
  class UnderlyingAdversaryAgainstTwiceSKE(AdversaryIndCpa):
    def __init__(self):
      self._used = False

    def Decide(self, oracle):
      # The argument 'oracle' comes from the reduction algorithm.
      if self._used:
        raise ValueError('UnderlyingAdversaryAgainstTwiceSKE.Decide: This method cannot be called twice.')
      self._used = True
      if not isinstance(oracle, OracleLR):
        raise ValueError('UnderlyingAdversaryAgainstTwiceSKE.Decide: The argument \'oracle\' does not implement \'OracleLR\'.')
      # This loop checks whether the reduction
      # correctly implements 'oracle'.
      trials = random.randint(8, 16)
      hits1 = 0
      lucky = True
      for i in range(trials):
        # Create two messages.
        M0 = os.urandom(16)
        M1 = M0
        while M0 == M1:
          M1 = os.urandom(16)
        # Request a ciphertext from the reduction algorithm.
        C = oracle.Encrypt(M0, M1)
        # Check whether 'C' is a ciphertext under 'TwiceSKE'.
        if ((not (isinstance(C, bytes) or isinstance(C, bytearray)))
            or len(C) != 64):
          raise ValueError('UnderlyingAdversaryAgainstTwiceSKE: I received something that is not a ciphertext of \'TwiceSKE\'.')
        # When the two parts of 'C' happens to be equal, we choose to not decide correctly.
        if C[0:32] == C[32:64]:
          lucky = False
        # This adversary cheats using the knowledge of 'K'.
        m1 = twiceSKE._SimpleSKE.Dec(C[0:32])
        m2 = twiceSKE._SimpleSKE.Dec(C[32:64])
        # In case someone does a hybrid / reverse-order reduction,
        # we still try to function as usual.
        if m1 == M1 and m2 == M1:
          hits1 += 1
      # Produce the desired advantage if all checks pass.
      if lucky and random.random() <= advantage:
        # This adversary intentionally inverts the answer.
        return 1 if hits1 < trials / 2 else 0
      return random.randint(0, 1)
  # Back in 'PrepareReductionTwiceSimple'.
  return MysteriousOracleLR(), UnderlyingAdversaryAgainstTwiceSKE

def TestReductionTwiceSimple(reduction, advantage, trials):
  trials = int(trials)
  if trials < 8 or trials > 65536:
    raise ValueError('The argument \'trials\' must be between 8 and 65536 (inclusive).')
  print('TestReductionTwiceSimple(%s):' % reduction.__qualname__)
  print('             underlying advantage = %f' % advantage)
  print('                 number of trials = %d' % trials)
  counts = [0, 0]
  for b in range(2):
    for i in range(trials):
      oracle, underlying = PrepareReductionTwiceSimple(b, advantage)
      c = reduction(underlying).Decide(oracle)
      if c != 0 and c != 1:
        raise ValueError('TestReductionTwiceSimple: reduction.Decide did not return a bit.')
      counts[b] += int(c)
  print('    estimated reduction advantage = %f' % (abs(counts[0] - counts[1]) / trials))
  print('')