#!/usr/bin/python

# This code has been tested with Python 3.7.0 (with pip installed).
# To install the cryptography library, run the following two commands:
#     python -m pip install --upgrade pip
#     python -m pip install cryptography
from hw6lib import OracleLR, AdversaryIndCpa, SKE
from hw6lib import SimpleSKE, AppendZeroSKE
from hw6lib import TestReductionAppendZeroSimple
import random

# This reduction algorithm shows
#     'SimpleSKE' is IND-CPA
# ==> 'AppendZeroSKE' is IND-CPA.
# This reduction itself is an adversary against IND-CPA of 'SimpleSKE'.
class GoodReduction1(AdversaryIndCpa):
  def __init__(self, underlying):
    # The argument 'underlying' is a class object.
    # The class itself implements 'AdversaryIndCpa' and
    # represents an adversary against 'AppendZeroSKE'.
    # Since 'underlying' is a class object, we use
    #     underlying()
    # to create a new instance of this class, i.e.,
    # launch a fresh instance of the underlying adversary.
    self._underlying = underlying()

  def Decide(self, oracle):
    # This method must return a bit.
    # The argument 'oracle' is an object, which is an instance of 'OracleLR'.
    # It will be LR0(SimpleSKE) or LR1(SimpleSKE), as expected since
    # this class 'GoodReduction1' is an adversary against 'SimpleSKE'.
    # The reduction algorithm uses the underlying adversary,
    # so it first prepares an oracle for the underlying adversary.
    class OracleForUnderlyingAdversary(OracleLR):
      def Encrypt(self, M0, M1):
        # When the underlying adversary calls this method Encrypt(M0, M1),
        # the reduction calls Encrypt(M0, M1) on its own 'oracle'.
        simpleC = oracle.Encrypt(M0, M1)
        # What the reduction algorithm gets from 'oracle'
        # is a ciphertext 'simpleC' under 'SimpleSKE'.
        # Think of 'oracle' as doing the first part of encryption
        # under 'AppendZeroSKE', and the reduction algorithm now
        # completes this encryption by appending zero.
        append0C = simpleC + b'\0'
        # Now, return this ciphertext 'append0C'
        # under 'AppendZeroSKE' to the underlying adversary.
        return append0C
        # Case 0: 'oracle' is LR0(SimpleSKE).
        #         'simpleC' encrypts 'M0' under key 'K' (unknown to reduction).
        #         'append0C' encrypts 'M0' under key 'K' (still unknown).
        #         This method called by the underlying adversary is
        #           LR0(AppendZeroSKE).
        # Case 1: 'oracle' is LR1(SimpleSKE).
        #         'simpleC' encrypts 'M1' under key 'K' (unknown to reduction).
        #         'append0C' encrypts 'M1' under key 'K' (still unknown).
        #         This method called by the underlying adversary is
        #           LR1(AppendZeroSKE).
    # Invoke the underlying adversary and use its decision bit.
    oracleForUnderlyingAdversary = OracleForUnderlyingAdversary()
    decision = self._underlying.Decide(oracleForUnderlyingAdversary)
    return decision

# This is another correct reduction.
class GoodReduction2(AdversaryIndCpa):
  def __init__(self, underlying):
    self._underlying = underlying()

  def Decide(self, oracle):
    class OracleForUnderlyingAdversary(OracleLR):
      def Encrypt(self, M0, M1):
        # Note that here we have REVERSED the order of plaintexts.
        # But this is OK, and the advantage will stay the same!
        # When 'GoodReduction2' talks to LR0(SimpleSKE),
        # it perfectly emulates LR1(AppendZeroSKE) for 'underlying'.
        # Similarly, LR1(SimpleSKE) <---> LR0(AppendZeroSKE), so
        # the "signed advantage" will be negated, and
        # the "unsigned advantage" stays intact
        # thanks to the absolute value.
        simpleC = oracle.Encrypt(M1, M0)
        #                        ^^  ^^
        # They were              M0, M1    in 'GoodReduction1'.
        append0C = simpleC + b'\0'
        return append0C
    oracleForUnderlyingAdversary = OracleForUnderlyingAdversary()
    decision = self._underlying.Decide(oracleForUnderlyingAdversary)
    return decision

# This is an incorrect reduction.
class BadReduction1(AdversaryIndCpa):
  def __init__(self, underlying):
    self._underlying = underlying()

  def Decide(self, oracle):
    append0SKE = AppendZeroSKE()
    b = random.randint(0, 1)
    class OracleForUnderlyingAdversary(OracleLR):
      def Encrypt(self, M0, M1):
        return append0SKE.Enc(M0 if b == 0 else M1)
    # The incorrect part here is that
    # 'oracleForUnderlyingAdversary' has NOTHING to do with 'oracle',
    # so the underlying adversary will not help us decide 'oracle'
    # (if it works, it only works to decide this independent oracle).
    # Since this reduction has the right format,
    # it will not raise any error,
    # but its advantage will be ZERO.
    oracleForUnderlyingAdversary = OracleForUnderlyingAdversary()
    decision = self._underlying.Decide(oracleForUnderlyingAdversary)
    return decision

# This is another incorrect reduction.
class BadReduction2(AdversaryIndCpa):
  def __init__(self, underlying):
    self._underlying = underlying()

  def Decide(self, oracle):
    # The incorrect part is that it lets the underlying adversary
    # talk to an oracle of incorrect format (the ciphertext created
    # by 'oracle' is not a ciphertext under 'AppendZeroSKE').
    # The underlying adversary will reject the ciphertext it receives
    # and will refuse to work.
    decision = self._underlying.Decide(oracle)
    return decision

# This is yet another incorrect reduction.
class BadReduction3(AdversaryIndCpa):
  def __init__(self, underlying):
    self._underlying = underlying()

  def Decide(self, oracle):
    class OracleForUnderlyingAdversary(OracleLR):
      def Encrypt(self, M0, M1):
        # The incorrect part is that it is appending zero
        # to the plaintext instead of the ciphertext.
        # The plaintext will be rejected by 'oracle'
        # because it has incorrect length.
        return oracle.Encrypt(M1 + b'\0', M0 + b'\0')
    oracleForUnderlyingAdversary = OracleForUnderlyingAdversary()
    decision = self._underlying.Decide(oracleForUnderlyingAdversary)
    return decision

TestReductionAppendZeroSimple(GoodReduction1, 0.1234, 2048)
TestReductionAppendZeroSimple(GoodReduction2, 0.5678, 2048)

TestReductionAppendZeroSimple(BadReduction1, 0.99, 2048)

try:
  TestReductionAppendZeroSimple(BadReduction2, 0.99, 2048)
except BaseException as err:
  print(err)
  print('')

try:
  TestReductionAppendZeroSimple(BadReduction3, 0.99, 2048)
except BaseException as err:
  print(err)
  print('')