Feature: AI output safety validation
  As a system protecting users from unsafe AI-generated content,
  I want to reject AI responses that contain unsafe temperatures or dangerous methods
  So that users are never exposed to hazardous cooking instructions

  Scenario: Safe instructions pass validation
    Given an AI response with instruction "Bake at 350°F for 30 minutes"
    When I validate the response
    Then validation should pass

  Scenario: Unsafe Fahrenheit temperature is rejected
    Given an AI response with instruction "Heat oil to 600°F"
    When I validate the response
    Then validation should throw an IllegalStateException

  Scenario: Unsafe Celsius temperature is rejected
    Given an AI response with instruction "Cook at 300°C until done"
    When I validate the response
    Then validation should throw an IllegalStateException

  Scenario: Dangerous deep fry method is rejected
    Given an AI response with instruction "Deep fry in a large vat of oil at 400°F"
    When I validate the response
    Then validation should throw an IllegalStateException

  Scenario: Substitution without a name is rejected
    Given an AI response with a substitution that has no name
    When I validate the response
    Then validation should throw an IllegalStateException

  Scenario: Substitution without an explanation is rejected
    Given an AI response with a substitution that has no why explanation
    When I validate the response
    Then validation should throw an IllegalStateException
