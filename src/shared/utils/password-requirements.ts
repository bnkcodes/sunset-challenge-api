import { PasswordValidationRequirement } from 'class-validator-password-check'

export class PasswordRequirements {
  minLength: number
  maxLength: number
  rules: PasswordValidationRequirement

  constructor() {
    this.minLength = 8
    this.maxLength = 20
    this.rules = {
      mustContainLowerLetter: true,
      mustContainNumber: true,
      mustContainSpecialCharacter: true,
      mustContainUpperLetter: true,
    }
  }
}
