---- MODULE MC ----
EXTENDS DijkstraMutex, TLC

\* MV CONSTANT declarations@modelParameterConstants
CONSTANTS
workerA, workerB, workerC
----

\* MV CONSTANT definitions Proc
const_1293897507996435000 == 
{workerA, workerB, workerC}
----

\* SPECIFICATION definition @modelBehaviorSpec:0
spec_1293897508011436000 ==
Spec
----
\* INVARIANT definition @modelCorrectnessInvariants:0
inv_1293897508027437000 ==
MutualExclusion
----
=============================================================================
\* Modification History
\* Created Sat Jan 01 07:58:28 PST 2011 by lamport
