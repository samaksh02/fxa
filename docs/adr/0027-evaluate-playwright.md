# Evaluate Playwright for our functional tests

## Context and Problem Statement

Our functional test suite currently has a 7% success rate when run against our stage environment after a deployment and a 44% success rate when run in CI for pull requests. These low rates are more from flaky tests and a finicky testing stack than legitimate bugs in the code being tested.

In stage this rate is too low to be able to confidently move to a continuous delivery pipeline. In CI it slows down development and decreases morale.

Because of our low success rate for pull requests each PR needs two runs of a relatively expensive task on average. In the last 90 days we used ~1.2M CircleCI credits for PRs. Ideally we could cut that in half.

We should evaluate other testing stack options to improve reliability.

## Goals and Outcomes

- Utilize and be confident in our functional test suite to enable a continuous delivery pipeline
- Increase test suite success rate
- Decrease testing runtime
- Reduce developer time debugging tests
- Improve test suite readability / maintainability
- Reduce test redundancy
- Reduce our CircleCI bill

## Decision Outcome

Playwright performs better than Intern in all goals. We should prefer it for new tests and begin migrating old tests when they need maintenance and on a case-by-case basis to improve our CI pass rate.

## Plan of action

1. Implement a proof-of-concept to determine if Playwright can meet the needs of our current test suite. **(Complete)**
2. Create a small test suite of difficult tests in Playwright from ones that have been notoriously flaky with Intern, and run both test stacks repeatedly in CI to evaluate which is more performant and reliable. **(Complete)**
3. Determine a winner and write a report of the results so that we can plan our next steps. **(Complete)**

## Test Results

A suite of 14 functional tests was used to compare the existing Intern/Selenium stack with Playwright. Each stack ran separately in CircleCI for 100 test runs with no retries.

The suite included one test that is known to be flaky independent of the testing stack, the "mocha tests". It was included because it's a good stress test for the stack and as a "control" for flakiness. Some failures of this test were expected, and aren't counted against a stack, however a large number of failures would indicate the stack is not a good fit.

The other failures were either caused by the test stack or the CI instance. Examples include the test stack crashing, a selector timeout, or the CI instance being unusually slow leading to test timeouts. Failure due to CI are noted but aren't counted against the "total ok". Playwright was run with tighter default test timeouts of 20 seconds compared to Intern with 45 seconds. It would have been better for both stacks to use the same timeout but I didn't realize the difference until all runs were complete.

| Result       | Intern | Playwright |
| ------------ | ------ | ---------- |
| Pass         | 87     | 90         |
| mocha fail   | 8      | 6          |
| CI fail      | 0      | 4          |
| stack fail   | 5      | 0          |
| **total ok** | **95** | **100**    |

### Other Observations

- Playwright averaged ~90 seconds (25%) faster per CI job
- Intern was more stable than expected
  - It seems smaller suites, compared to our usual CI jobs, are more stable
