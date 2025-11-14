export type UserType =
  | 'standard'
  | 'locked'
  | 'problem'
  | 'performance'
  | 'error'
  | 'visual'
  | 'wrongUser';

export const PASSWORD = 'secret_sauce';

export const testAccounts: Record<UserType, string> = {
  standard: 'standard_user',
  locked: 'locked_out_user',
  problem: 'problem_user',
  performance: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
  wrongUser: 'wrong_user'
};