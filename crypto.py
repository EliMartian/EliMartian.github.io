#!/usr/bin/python

# This code has been tested with Python 3.7.0 (with pip installed).
# To install the cryptography library, run the following two commands:
#     python -m pip install --upgrade pip
#     python -m pip install cryptography
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import sys

cipher1 = 111100001111000011110000111100001111000011110000

def XOR(x, y, z):
  return int(int(x) ^ int(y) ^ int(z))

def PadOracle(ciphertext):
  if len(ciphertext) < 32 or len(ciphertext) % 16 != 0:
    return False
  # Do not cheat --- of course
  # ciphertexts can be decrypted using the hardcoded key,
  # but this is not the goal. OK? :)
  decryptor = Cipher(
    algorithms.AES(b"Sixteen byte key"),
    modes.CBC(ciphertext[:16]),
    backend=default_backend()
  ).decryptor()
  decrypted = decryptor.update(ciphertext[16:]) + decryptor.finalize()
  last = int(decrypted[-1])
  if last < 1 or last > 16:
    return False
  for i in range(last):
    if int(decrypted[-1 - i]) != last:
      return False
  return True

if len(sys.argv) < 1:
  print("You need to specify a file!")
  exit()

ciphertext = None
with open(sys.argv[1], "rb") as ciphertext_file:
  ciphertext = ciphertext_file.read()


testCiphertext = ciphertext
intList = [int(t) for t in testCiphertext]
intermediateList = [0] * len(intList)

# q loops through all of the 16-byte blocks until reaching the end of the ciphertext blocks
for q in range(1, int(((len(intList) - 16) / 16)) + 1):
  # j loops through each individual byte of the overall 16-byte ciphertext block
  for j in range(1, 17): 
    X = -1
    setter = 0
    # testing each possible value 
    for i in range(0, 256): 
      X += 1
      
      # making sure to assign the value of the current ciphertext byte to be X 
      intList[len(intList)-(16*q)-j] = X

      # capturing value returned by padding oracle
      value = PadOracle(bytes(intList))
      if (i == 255 and value == False):
        print("No value found")
      if (value == True):
        # updating the intermediate list block to be the true value of X (XORed with j)
        intermediateList[len(intList)-(16*q)-j] = (intList[len(intList)-(16*q)-j] ^ j)
  
        # loops backwards to set all the previous ciphertext bytes to the right value
        # so that when we are experimenting on the current byte, everybody before it 
        # aligns correctly to make a valid padding so we can figure out what the 
        # current byte should be set to (testing what is valid padding)
        for f in range(0, j):
          setter = (intList[len(intList)-(16*q)-j+f] ^ j) ^ (j+1)
          intList[len(intList)-(16*q)-j+f] = setter
        value = False
        break
      

  # This has been one of the hardest coding assignments I have ever done in my entire life and 4 years at UW :(

  print("starting analysis of intermediate data")
  for z in range(1, 17):
      print(intermediateList[len(intList)-(16*q)-z])
  #print(len(intList))

# Please put the padding oracle attack here.
# The variable "ciphertext" contains the ciphertext.
# The plaintexts in the two example ciphertexts are English text in UTF-8.
# To decode *complete* UTF-8 sequences, use b'...'.decode('utf8').
# If you have multiple subsequences and would like to decode
# without first concatenating all of them, you can use the
# codecs library (https://docs.python.org/3/library/codecs.html).