# Mr. Bennet's Problem

**[Click Here to Launch the Interactive Activity](https://financeprofessormckee.github.io/Pride-and-Prejudice-Activity/)**

> *"Mr. Bennet had very often wished before this period of his life that, instead of spending his whole income, he had laid by an annual sum, for the better provision of his children, and of his wife, if she survived him."*  
> — **Jane Austen, *Pride & Prejudice* (Chapter 50)**

Welcome! This repository hosts an interactive web-based teaching tool where users step into the shoes of Mr. Bennet. The objective is to build a fund that can support his 6 dependents (his wife and 5 daughters) after his death by adjusting savings, time, and interest rates.

## Case Assumptions & The Challenge
The target goal is to match the family's current living standard of **$25,000 per person per year**. 
* **Annual Household Income:** $175,000 (inflation-adjusted)
* **Current Household:** 7 members (Mr. & Mrs. Bennet + 5 daughters)
* **Dependents to Support:** 6
* **Interest Rate Choices:** 4% or 5% (based on historical government bond rates)

**The Challenge:** If Mr. Bennet saves consistently, can the fund generate $25,000 per dependent per year? 

## Educator Guide: Classroom Integration
This simulation is designed as a supplementary tool for teaching the **Future Value (FV) of an Annuity**, **Perpetuities**, and the **Time Value of Money (TVM)**. 

### The Financial Model
To help students understand the underlying math, the tool relies on the following mechanics:
* **Accumulated Fund:** Calculated as the Future Value of an ordinary annuity based on the user's chosen annual contribution and timeline.
* **Perpetuity Payout:** The tool uses a standard perpetuity model where only the interest is withdrawn and the principal is preserved. 
* **Income Calculation:** The annual income per dependent is estimated as: `(Final Balance × Income Rate) ÷ 6 Dependents`.
* **Rate Consistency:** The simulation uses the same interest rate for both the accumulation phase (investment growth) and the income generation phase as a standard simplifying assumption.

### Assignment Suggestions
You can use this interactive tool as the foundation for a homework assignment or case study write-up. 

**1. The "What If" Scenario Analysis**
Have students experiment with the sliders to find the exact combination of variables required to hit the $25,000 per dependent target. Because starting late makes the target mathematically difficult to reach, this clearly demonstrates the power of compound interest over time.

**2. Utilizing the "Copy Summary" Feature**
The app includes a built-in "Copy summary" button. You can require students to paste their final simulation results directly into their Learning Management System or written case study. The output generates a clean text block including:
* **Inputs:** Annual Contribution (%), Years Saving, Interest Rate, and Dependents.
* **Outputs:** Accumulated Fund (FV), Annual Income per Dependent, and the percentage of the target goal reached (e.g., *Insufficient: 19% of $25,000 target*).

### Discussion Prompts
* How does changing the historical bond yield from 4% to 5% impact the required annual contribution?
* If Mr. Bennet saves 10% of his income ($17,500/year) for 25 years at 4%, the fund only reaches $728,803, providing just $4,859 per dependent. What realistic sacrifices would the family have to make today to reach the $25,000 goal for tomorrow?

---
*Created by [Eric McKee](https://github.com/financeprofessormckee).*
