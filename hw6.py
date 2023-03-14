#!/usr/bin/python

# This code has been tested with Python 3.7.0 (with pip installed).
# To install the cryptography library, run the following two commands:
#     python -m pip install --upgrade pip
#     python -m pip install cryptography
from hw6lib import OracleLR, AdversaryIndCpa, SKE
from hw6lib import SimpleSKE, TwiceSKE
from hw6lib import TestReductionTwiceSimple

# This reduction algorithm should show
#     'SimpleSKE' is IND-CPA
# ==> 'TwiceSKE' is IND-CPA.
# This reduction itself is an adversary against IND-CPA of 'SimpleSKE'.
class MyReduction(AdversaryIndCpa):
  def __init__(self, underlying):
    # Put your implementation here.
    self._underlying = underlying()

  def Decide(self, oracle):
    # Put your implementation here.
    class OracleForUnderlyingAdversary(OracleLR):
        def Encrypt(self, M0, M1): 
            C0 = oracle.Encrypt(M0, M1)
            C1 = oracle.Encrypt(M0, M1)
            concat = C0 + C1
            return concat
    oracleForUnderlyingAdversary = OracleForUnderlyingAdversary()
    decision = self._underlying.Decide(oracleForUnderlyingAdversary)
    return decision

TestReductionTwiceSimple(MyReduction, 0.1234, 2048)
TestReductionTwiceSimple(MyReduction, 0.6789, 2048)
TestReductionTwiceSimple(MyReduction, 1.0000, 2048)