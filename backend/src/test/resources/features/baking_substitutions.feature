Feature: Baking Mode substitutions
  As a user who wants healthier baked goods,
  I want the Baking Mode to swap ingredients using a safe, chemically-vetted database
  So that my baked goods still work but are healthier

  Scenario: Butter is substituted with applesauce at intensity 3
    Given a baking recipe with ingredient "2 cup butter"
    When I healthify it in BAKING mode at intensity 3
    Then the substituted ingredient name should contain "applesauce"
    And the substituted amount should be "1.5"
    And a safety note about oven temperature should be present

  Scenario: Oil is substituted with applesauce at intensity 3
    Given a baking recipe with ingredient "1 cup oil"
    When I healthify it in BAKING mode at intensity 3
    Then the substituted ingredient name should contain "applesauce"
    And the substituted amount should be "1"

  Scenario: All-purpose flour is substituted with whole wheat flour at intensity 4
    Given a baking recipe with ingredient "2 cup all-purpose flour"
    When I healthify it in BAKING mode at intensity 4
    Then the substituted ingredient name should contain "whole wheat flour"
    And the substituted amount should be "1.75"
    And a safety note about extra liquid should be present

  Scenario: Sugar is substituted with coconut sugar at intensity 3
    Given a baking recipe with ingredient "1 cup sugar"
    When I healthify it in BAKING mode at intensity 3
    Then the substituted ingredient name should contain "coconut sugar"
    And the substituted amount should be "1"

  Scenario: Milk is substituted with almond milk at intensity 1
    Given a baking recipe with ingredient "1 cup milk"
    When I healthify it in BAKING mode at intensity 1
    Then the substituted ingredient name should contain "almond milk"

  Scenario: Egg is substituted with flax egg at intensity 3
    Given a baking recipe with ingredient "2 egg"
    When I healthify it in BAKING mode at intensity 3
    Then the substituted ingredient name should contain "flaxseed"

  Scenario: Spices are never substituted
    Given a baking recipe with ingredient "1 tsp cinnamon"
    When I healthify it in BAKING mode at intensity 5
    Then no substitution should be made for that ingredient

  Scenario: Light intensity only substitutes dairy
    Given a baking recipe with ingredients "1 cup butter" and "1 cup milk"
    When I healthify it in BAKING mode at intensity 1
    Then "milk" should be substituted
    And "butter" should not be substituted
