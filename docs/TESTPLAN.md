# COBOL Account Management Test Plan

This test plan documents the current COBOL application business logic and implementation flow for stakeholder validation. It is designed to cover all menu operations, account updates, and business rules.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-001 | Display the account menu | Application is started | 1. Start the COBOL application
2. Observe the displayed menu | The menu displays options: View Balance, Credit Account, Debit Account, Exit |  |  |  | Menu should appear before any action |
| TC-002 | View current account balance | Application is started, initial balance is set to 1000.00 | 1. Start the COBOL application
2. Enter choice `1` | The application displays `Current balance: 001000.00` or equivalent formatted balance |  |  |  | Balance should reflect initial stored value |
| TC-003 | Credit the account with a valid amount | Application is started, current balance is known | 1. Start the COBOL application
2. Enter choice `2`
3. Enter credit amount `200.00` | The application updates the balance to `1200.00` and displays the new balance |  |  |  | Confirm balance increment by the entered credit amount |
| TC-004 | Debit the account with a valid amount | Application is started, current balance is sufficient (>= requested debit) | 1. Start the COBOL application
2. Enter choice `3`
3. Enter debit amount `500.00` | The application deducts the amount from the balance and displays the new balance |  |  |  | Balance should decrease by the entered debit amount |
| TC-005 | Debit the account with insufficient funds | Application is started, current balance is lower than requested debit | 1. Start the COBOL application
2. Enter choice `3`
3. Enter debit amount greater than current balance | The application displays `Insufficient funds for this debit.` and does not update the balance |  |  |  | Confirm no balance change occurs on failed debit |
| TC-006 | Exit the application from the menu | Application is started | 1. Start the COBOL application
2. Enter choice `4` | The application exits and displays `Exiting the program. Goodbye!` |  |  |  | The program should terminate cleanly |
| TC-007 | Handle invalid menu choice | Application is started | 1. Start the COBOL application
2. Enter an invalid choice (e.g. `9` or `A`) | The application displays `Invalid choice, please select 1-4.` and returns to the menu |  |  |  | The program should not terminate on invalid input |
| TC-008 | Persist balance within program session after credit | Application is started, current balance is known | 1. Start the COBOL application
2. Enter choice `2`
3. Enter credit amount `50.00`
4. After success, choose `1` to view balance | The displayed balance reflects the credited amount from the prior operation |  |  |  | Confirms data storage logic across calls during the same run |
| TC-009 | Persist balance within program session after debit | Application is started, current balance is sufficient | 1. Start the COBOL application
2. Enter choice `3`
3. Enter debit amount `50.00`
4. After success, choose `1` to view balance | The displayed balance reflects the debited amount from the prior operation |  |  |  | Confirms data storage logic is correctly updated after debit |
| TC-010 | Ensure `DataProgram` read/write behavior | Application is started | 1. Perform a `READ` operation via View Balance
2. Perform a `WRITE` operation via credit or debit
3. Perform another `READ` operation | The first read returns stored balance, the write updates the stored balance, and the second read returns the updated value |  |  |  | Confirms linkage and data handoff between `Operations` and `DataProgram` |

## Notes for stakeholders

- The application does not persist data between runs; balance state exists only while the program is running.
- The initial balance is defined in `src/cobol/data.cob` as `1000.00`.
- Business rules are implemented in `src/cobol/operations.cob` and enforced on debit operations.
- The plan captures both functional behavior and expected messaging for validation.
