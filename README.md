# Mr. Bennet's Decision

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

### License and Citation

The source code for this web application is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute the software.

The pedagogical framing, narrative text, and specific simulation parameters (The "Mr. Bennet's Problem" scenario) are the intellectual property of Eric McKee. If you use or adapt this simulation for your own courses, please cite this repository.

---
*Created by [Eric McKee](https://github.com/financeprofessormckee).*
