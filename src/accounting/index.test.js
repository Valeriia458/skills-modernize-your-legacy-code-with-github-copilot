const {
  initialBalance,
  formatCurrency,
  resetBalance,
  readBalance,
  creditBalance,
  debitBalance,
  getMenuText,
  getChoiceAction,
} = require('./index');

describe('Accounting application', () => {
  beforeEach(() => {
    resetBalance();
  });

  test('TC-001: menu contains the expected options', () => {
    const menu = getMenuText();
    expect(menu).toContain('Account Management System');
    expect(menu).toContain('1. View Balance');
    expect(menu).toContain('2. Credit Account');
    expect(menu).toContain('3. Debit Account');
    expect(menu).toContain('4. Exit');
  });

  test('TC-002: view current account balance shows initial balance', () => {
    expect(formatCurrency(readBalance())).toBe('1000.00');
  });

  test('TC-003: crediting the account updates the balance', () => {
    const result = creditBalance(200.0);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(1200.0);
    expect(result.message).toBe('Amount credited. New balance: 1200.00');
    expect(formatCurrency(readBalance())).toBe('1200.00');
  });

  test('TC-004: debiting the account with sufficient funds updates the balance', () => {
    const creditResult = creditBalance(100.0);
    expect(creditResult.success).toBe(true);
    const result = debitBalance(500.0);
    expect(result.success).toBe(true);
    expect(result.newBalance).toBe(600.0);
    expect(result.message).toBe('Amount debited. New balance: 600.00');
    expect(formatCurrency(readBalance())).toBe('600.00');
  });

  test('TC-005: debiting with insufficient funds does not change the balance', () => {
    const result = debitBalance(1500.0);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Insufficient funds for this debit.');
    expect(formatCurrency(readBalance())).toBe(formatCurrency(initialBalance));
  });

  test('TC-006: exit choice is recognized in choice action mapping', () => {
    expect(getChoiceAction('4')).toBe('exit');
  });

  test('TC-007: invalid menu choice returns invalid action', () => {
    expect(getChoiceAction('9')).toBe('invalid');
    expect(getChoiceAction('A')).toBe('invalid');
  });

  test('TC-008: balance persists after credit within program session', () => {
    const creditResult = creditBalance(50.0);
    expect(creditResult.success).toBe(true);
    expect(formatCurrency(readBalance())).toBe('1050.00');
  });

  test('TC-009: balance persists after debit within program session', () => {
    const debitResult = debitBalance(50.0);
    expect(debitResult.success).toBe(true);
    expect(formatCurrency(readBalance())).toBe('950.00');
  });

  test('TC-010: read/write behavior updates stored balance correctly', () => {
    expect(formatCurrency(readBalance())).toBe('1000.00');
    const writeResult = creditBalance(75.0);
    expect(writeResult.success).toBe(true);
    expect(formatCurrency(readBalance())).toBe('1075.00');
    const secondRead = readBalance();
    expect(secondRead).toBe(1075.0);
  });
});
