Feature: Bonus SuperAdmin - Rules Builder

  # Story 1: Create and review a rule via modal
  Scenario Outline: Create a rule with type, operator and value
    Given I am on the rules builder page
    When I click "Add rule to group"
    And I select "<ruleType>" as rule type
    And I select "<operator>" as operator
    And I enter "<value>" as value
    And I save the rule
    Then I should see "<ruleType>" with "<operator>" and "<value>" in the group table

    Examples:
      | ruleType           | operator               | value       |
      | Product category   | Equals                 | Electronics |
      | Product SKU        | Contains               | SKU-100     |
      | Eligible revenue   | Greater than or equal to | 500        |
      | Tier               | Is in list             | Gold        |
      | Order total        | Less than              | 1000        |
      | Customer segment   | Not equals             | Inactive    |
      | Quantity           | Greater than           | 5           |

  Scenario Outline: Add multiple values with connectors
    Given I am creating a rule with type "<ruleType>" and operator "<operator>"
    When I add values "<value1>" and "<value2>"
    And I set the connector to "<connector>"
    And I save the rule
    Then I should see "<value1> <connector> <value2>" in the rule values

    Examples:
      | ruleType         | operator | value1      | value2   | connector |
      | Product category | Equals   | Electronics | Clothing | or        |
      | Product SKU      | Equals   | SKU-100     | SKU-200  | and       |

  Scenario Outline: Configure rule date range
    Given I am creating a rule
    When I set use default dates to "<useDefault>"
    And I set the start date to "<startDate>"
    And I set the end date to "<endDate>"
    Then the rule should have date range "<startDate>" to "<endDate>"

    Examples:
      | useDefault | startDate  | endDate    |
      | no         | 2026-01-01 | 2026-12-31 |
      | no         | 2026-06-01 |            |
      | yes        |            |            |


  # Story 2: Build complex logic with groups and sub-rules
  Scenario Outline: Set logic operators at global and group level
    Given I am on the rules builder page
    When I set the global logic to "<globalOp>"
    And I set group 1 logic to "<groupOp>"
    Then the offer should evaluate using "<globalOp>" across groups
    And group 1 should evaluate using "<groupOp>" across rules

    Examples:
      | globalOp | groupOp |
      | any      | any     |
      | all      | all     |
      | any      | all     |

  Scenario Outline: Add a sub-rule to a rule
    Given I have a rule with type "<parentType>" and operator "<parentOp>"
    When I add a sub-rule with type "<subType>" operator "<subOp>" and value "<subVal>"
    Then I should see the sub-rule under the parent rule when expanded

    Examples:
      | parentType       | parentOp | subType          | subOp              | subVal  |
      | Product category | Equals   | Eligible revenue | Greater than       | 500     |
      | Tier             | Equals   | Customer segment | Not equals         | Basic   |
      | Order total      | Greater than | Quantity     | Greater than or equal to | 3 |

  Scenario: Add multiple rule groups
    Given I have a rule group with one rule
    When I click "Add rule group"
    And I add a rule to group 2
    Then I should see 2 rule groups on the page


  # Story 3: Manage and validate rules
  Scenario Outline: Remove a rule or group
    Given I have a rule group with rules
    When I click remove on the "<target>"
    Then the "<target>" should be removed

    Examples:
      | target     |
      | rule       |
      | rule group |

  Scenario: Edit an existing rule
    Given I have a saved rule in a group
    When I click "View" on the rule
    Then the rule modal should open with existing values
    And I should be able to modify and save changes

  Scenario: Rule type and operator are required
    Given I open the create rule modal
    When I try to save without selecting a rule type
    Then the rule should not be saved
