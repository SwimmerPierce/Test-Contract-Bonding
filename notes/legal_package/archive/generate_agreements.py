# -*- coding: utf-8 -*-
import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_execution_ready_document():
    doc = docx.Document()
    
    # Page setup - 1 inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(0x22, 0x22, 0x22)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    # Helper for headings
    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(text)
        run.bold = True
        run.font.size = Pt(15)
        run.font.color.rgb = RGBColor(0x0f, 0x2b, 0x5c) # Deep navy
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.space_before = Pt(0)
        return p

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(text)
        run.italic = True
        run.font.size = Pt(11)
        run.font.color.rgb = RGBColor(0x55, 0x55, 0x55)
        p.paragraph_format.space_after = Pt(14)
        return p

    def add_h1(text):
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.bold = True
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0x0f, 0x2b, 0x5c)
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.bold = True
        run.font.size = Pt(11)
        run.font.color.rgb = RGBColor(0x1a, 0x1a, 0x1a)
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(3)
        return p

    def add_p(text, bold_prefix=None):
        p = doc.add_paragraph()
        if bold_prefix:
            r_bold = p.add_run(bold_prefix)
            r_bold.bold = True
        p.add_run(text)
        p.paragraph_format.space_after = Pt(5)
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        if bold_prefix:
            r_bold = p.add_run(bold_prefix)
            r_bold.bold = True
        p.add_run(text)
        p.paragraph_format.space_after = Pt(3)
        return p

    # Build Document
    add_title("DOMAIN & PLATFORM LICENSE AND PRODUCER COMMISSION ADDENDUM")
    add_subtitle("Execution-Ready Legal Agreement - Personal Domain/IP Ownership + Exclusive Operating License")

    add_p("THIS DOMAIN & PLATFORM LICENSE AND PRODUCER COMMISSION ADDENDUM (the \"Addendum\") is entered into and made effective as of [DATE] (the \"Effective Date\"),")
    add_p("BETWEEN:", bold_prefix=None)
    add_p("CHASE PIERCE ADDISON, holder of British Columbia General Insurance Level 1 Salesperson Licence #[LICENCE_NO], residing at [CHASE_ADDRESS] (hereinafter referred to as the \"Licensor\" or \"Producer\")", bold_prefix=None)
    add_p("AND:", bold_prefix=None)
    add_p("NEXUS INSURANCE BROKERS LTD., a corporation duly incorporated under the laws of British Columbia (Incorporation No. [INC_NO]), licensed as a general insurance agency by the Insurance Council of British Columbia (Licence No. [AGENCY_LICENCE_NO]), having its head office at Suite [SUITE_NO], Burnaby, British Columbia, V5H [POSTAL_CODE] (hereinafter referred to as the \"Brokerage\"),", bold_prefix=None)
    add_p("(Collectively referred to as the \"Parties\" and individually as a \"Party\".)", bold_prefix=None)

    add_h1("1. RECITALS, DEFINITIONS & GOVERNANCE PARAMOUNTCY")
    add_p(" The Producer is the sole personal registrant of the Canadian Internet Registration Authority (CIRA) domain name contractbonding.ca and the sole creator, author, and owner of the associated website, the GitHub software repository SwimmerPierce/Test-Contract-Bonding and any databases contained therein (collectively, \"The Source Code\"), calculator logic, digital assets, user interfaces, and administrative software web application (collectively, the \"Platform\"). For certainty, the \"Platform\" is strictly limited to contractbonding.ca and The Source Code, and expressly excludes all separate personal projects, procurement scrapers, databases, AI skills, and background repositories identified in Schedule B (\"Excluded Personal IP\").", bold_prefix="1.1 Ownership of Domain & Platform.")
    add_p(" As of the Effective Date, the Producer holds a General Insurance Level 1 Salesperson licence in British Columbia sponsored by and operating under the regulatory supervision of the Brokerage and its Level 3 Nominee / Designated Representative.", bold_prefix="1.2 Current Producer Licensing.")
    add_p(" Under the British Columbia Financial Institutions Act (RSBC 1996, c. 141), the Insurance Council of British Columbia Rules (including Rules 6 and 7), the Alberta Insurance Act (RSA 2000, c. I-3), and equivalent provincial insurance legislation, all insurance and surety bond solicitation, underwriting submissions, commission collection, interprovincial referrals, and client personal information custody must be conducted solely by and through an appropriately licensed insurance agency and individually licensed intermediaries.", bold_prefix="1.3 Regulatory Compliance Objective.")
    add_p(" The Parties wish to operate the Platform publicly as an official surety service of the Brokerage while preserving the Producer's absolute personal title and proprietary rights to the Platform, establishing objective rules for licence progression and multi-province expansion, setting infrastructure funding terms, and defining producer compensation and buyout rights across all revenue streams.", bold_prefix="1.4 Intent of Parties.")
    add_p(" The Parties expressly acknowledge and agree that this Addendum is entered into for good, valuable, and fresh legal consideration (the receipt and sufficiency of which are hereby acknowledged by each Party), including the grant of the exclusive operating license hereunder, the corporate funding of infrastructure expenses, the enhanced commission schedules, the mutual covenants, and the payment of $10.00 CAD by each Party to the other. This Addendum amends, supplements, and supersedes any legacy employment agreement, offer letter, or workplace arrangement between the Producer and the Brokerage (including, without limitation, the legacy employment contract originally entered into over ten years ago under the title \"Marketing Coordinator\") to the extent of any inconsistency. To the maximum extent permitted by law, this Addendum expressly overrides, extinguishes, and supersedes any prior work-for-hire, assignment of intellectual property, invention assignment, or non-solicitation restrictions that might otherwise apply to the Platform, The Source Code, or any Schedule B Excluded Personal IP.", bold_prefix="1.5 Consideration & Paramountcy Over Legacy Employment Agreement.")
    add_p(" The Brokerage and its executing officers confirm that this Addendum, and the transactions and related-party arrangements contemplated herein, have been fully disclosed to the board of directors and voting shareholders of Nexus Insurance Brokers Ltd. in compliance with Sections 147 through 149 of the British Columbia Business Corporations Act (SBC 2002, c. 57) (the \"BCBCA\"). Kenneth James Addison, in his capacity as President, director, Level 3 Nominee, and 90% majority voting shareholder, has disclosed his conflict of interest as the father of the Producer. The remaining voting shareholder (holding all remaining issued and outstanding voting shares of the Brokerage) has reviewed, approved, and joined in the execution of this Addendum. By executing this Addendum, all voting shareholders of the Brokerage unanimously ratify the terms hereof as fair and reasonable to the Brokerage, waive any procedural defects or conflict-of-interest challenges under BCBCA Sections 147 through 149, and covenant not to assert any claim of corporate waste or shareholder oppression under Section 227 of the BCBCA in respect of this Addendum.", bold_prefix="1.6 Corporate Authority & Related-Party Ratification (BCBCA Sections 147-149).")

    add_h1("2. GRANT OF EXCLUSIVE OPERATING LICENSE")
    add_p(" Subject to the terms and conditions of this Addendum, the Licensor hereby grants to the Brokerage an exclusive, non-transferable, revocable license to operate, display, and conduct licensed insurance and surety brokerage business through the Platform (contractbonding.ca) across all Authorized Brokerage Jurisdictions (the \"License\"). The License is revocable strictly and exclusively in accordance with the termination triggers and departure provisions set forth in Section 7.2 of this Addendum, and is not terminable at-will mid-term by either Party without complying with Section 7.", bold_prefix="2.1 License Grant & Revocability Standard.")
    add_p(" During the Term, the Platform shall prominently display the Brokerage's legal corporate name (Nexus Insurance Brokers Ltd.), head office Burnaby address, and regulatory licensing disclosures, and shall present contractbonding.ca strictly as a surety service operated by the Brokerage (and, upon registration, an approved DBA / trade name of the Brokerage). The Licensor shall not hold out contractbonding.ca as an independent, standalone, or unlicensed insurance brokerage entity.", bold_prefix="2.2 Public Branding & Trade Name Control.")
    add_p(" The License granted herein is personal to the Brokerage. The Brokerage shall not sub-license, assign, delegate, or transfer the License, administrative access to the Platform, or hosting accounts to any third party without the Producer's prior express written consent.", bold_prefix="2.3 No Sub-Licensing or Assignment.")

    add_h1("3. RETENTION OF TITLE AND INTELLECTUAL PROPERTY")
    add_p(" Nothing in this Addendum transfers, conveys, or assigns legal or beneficial ownership of the contractbonding.ca domain name, domain registrar accounts, DNS records, brand trademarks, source code repositories, calculator logic, frontend assets, or backend web application infrastructure from the Licensor to the Brokerage. All right, title, and intellectual property interest in and to the Platform remain the sole, unencumbered personal property of Chase Pierce Addison.", bold_prefix="3.1 Absolute Title Retained by Producer.")
    add_p(" All active insurance policies, executed surety bonds, insurer agency contracts, and official underwriting records bound through the Brokerage constitute the regulatory client records of the Brokerage, subject strictly to the Producer's earned commission entitlements under Schedule A and the Producer's Deal / Book-of-Business Buyout Payout (and optional Client Book Transfer Election) under Section 7.4.", bold_prefix="3.2 Regulatory Client Book & Underwriting Files.")
    add_p(" The Parties expressly distinguish between the Platform's proprietary technology stack and the Brokerage's regulatory underwriting records. Upon any termination of this Addendum, the Producer retains 100% sole ownership, custody, and operational control of the Platform's production database, software architecture, schema, relational structure, analytics models, marketing lead records, and uncompleted questionnaire data, unless separately purchased by the Brokerage under a standalone, written commercial data purchase agreement. To satisfy statutory compliance without transferring database ownership, the Brokerage is entitled solely to receive a one-time secure archival export of active bound client underwriting files and policy records required for its mandatory seven (7) year regulatory record retention obligations under the British Columbia Financial Institutions Act, the Insurance Council of British Columbia Rules, the Alberta Insurance Act, and applicable provincial privacy legislation (BC/AB PIPA). Following delivery of such archival export, the Brokerage shall have no proprietary claim to the Platform's database or technical schema.", bold_prefix="3.3 Database Ownership & Statutory 7-Year Regulatory Data Retention.")
    add_p(" The Parties expressly acknowledge and agree that all separate software repositories, public procurement scrapers, databases, AI agent skills, and automation tools created or maintained by Chase Pierce Addison outside of The Source Code, including without limitation the GitHub repository https://github.com/SwimmerPierce/BC_Bid_Organizer_Skill and any databases contained therein (collectively, \"The Intelligence Tool\") and all past, present, and future personal projects listed in Schedule B (\"Excluded Personal IP\"), are and remain 100% the sole, unencumbered personal property of Chase Pierce Addison. Specifically:", bold_prefix="3.4 Excluded Personal IP & Background Tools (Schedule B).")
    add_bullet(" Excluded Personal IP has been and will continue to be developed independently outside of Brokerage time, using personal accounts and infrastructure. The Brokerage acquires zero ownership, license, work-for-hire claim, or exclusivity right over any Schedule B asset.", bold_prefix="(a) No License, Exclusivity, or Work-for-Hire Claim:")
    add_bullet(" Raw public procurement datasets, bid histories, RFP summaries, and contact lists generated by The Intelligence Tool are the sole property of Chase Pierce Addison. Only when a prospective client submits an insurance application via contractbonding.ca or enters active underwriting with the Brokerage does that specific client file become a regulatory underwriting record subject to Brokerage supervision.", bold_prefix="(b) Raw Public Data vs. Brokerage Client File Boundary:")
    add_bullet(" Inbound leads generated through contractbonding.ca and outbound prospects originated using data or prospect lists exported from Schedule B tools (such as The Intelligence Tool) shall be tagged with the source code \"CB-WEB\" in the Brokerage's CRM and management system, and shall be fully entitled to Schedule A commission splits and the Section 7.4 buyout payout.", bold_prefix="(c) Full Attribution to CB-WEB Book:")

    add_h1("4. REGULATORY SUPERVISION, LICENCE UPGRADE & EXPANDED CAPACITY")
    add_p(" For so long as the Producer holds a Level 1 General Insurance licence in British Columbia:", bold_prefix="4.1 Level 1 Authority Limits (Insurance Council Rule 6(1)(a) & Rule 6(1)(c)).")
    add_bullet(" The Producer shall not sign, seal, or execute any surety bond (including Bid Bonds, Consents of Surety, Performance Bonds, or Labour and Material Payment Bonds) or binding insurance binder on behalf of the Brokerage or any surety company.", bold_prefix="(a) Prohibition on Execution:")
    add_bullet(" All surety bonds and insurance policies must be reviewed, approved, and executed solely by a licensed Level 2 or Level 3 General Insurance intermediary or designated Nominee of the Brokerage.", bold_prefix="(b) Supervisory Review & Execution:")
    add_bullet(" All insurance and surety activities conducted by the Producer through the Platform shall be carried out under the direct supervision of the Brokerage's Level 3 Nominee / Designated Representative.", bold_prefix="(c) Nominee Supervision:")
    add_p(" The Parties expressly agree that the operational relationship and bonding capacity shall expand automatically as the Producer advances their professional licensing:", bold_prefix="4.2 Level 2 Licence Upgrade & Expanded Surety Bonding Capacity.")
    add_bullet(" Immediately upon the Producer obtaining a General Insurance Level 2 Agent licence (or higher) in British Columbia, all Level 1 supervision and signing limitations set forth in Section 4.1 shall terminate automatically without requiring an amendment to this Addendum. The Producer shall thereupon possess full independent authority to solicit, negotiate, manage, and service surety and commercial insurance accounts directly.", bold_prefix="(a) Removal of Level 1 Supervision:")
    add_bullet(" Upon obtaining a Level 2 licence, the Producer's capacity shall expand from transactional bonding to managing complex surety facilities, including established commercial and civil general contractors, joint ventures, multi-million dollar annual bonding programs, and specialized bond wordings.", bold_prefix="(b) Expanded Bonding Authority:")
    add_bullet(" Upon the Producer achieving Level 2 licensing, the Brokerage shall promptly request and sponsor Attorney-in-Fact (Power of Attorney) appointments from all surety companies with which the Brokerage maintains surety agency agreements, authorizing the Producer to execute and seal bonds directly on behalf of such surety underwriters.", bold_prefix="(c) Attorney-in-Fact Appointments:")
    add_bullet(" Upon upgrading to Level 2 (or obtaining any required provincial non-resident licence), the Producer shall have the unilateral right to assume primary day-to-day servicing of renewing CB-WEB accounts previously serviced by another Brokerage broker under Stream B, thereby converting the Producer's renewal compensation to the 35% active-servicing renewal split under Schedule A.", bold_prefix="(d) Right to Assume Servicing on Renewals:")
    add_p(" The Brokerage shall notify its Errors & Omissions (E&O) insurance underwriter of the operation of contractbonding.ca as an approved online surety channel and DBA of the Brokerage, and shall maintain continuous, uninterrupted E&O insurance coverage (with policy limits of not less than $2,000,000 per claim / $2,000,000 aggregate) covering all surety bond and commercial insurance activities conducted through the Platform.", bold_prefix="4.3 Errors & Omissions (E&O) Insurance (Insurance Council Rule 7(11)).")
    add_p(" The Brokerage acts as the accountable organization under the British Columbia Personal Information Protection Act (PIPA), the Alberta Personal Information Protection Act, and the federal Personal Information Protection and Electronic Documents Act (PIPEDA) for all client personal information collected through contractbonding.ca. The Brokerage shall ensure all commercial electronic messages sent via the Platform strictly comply with Canada's Anti-Spam Legislation (CASL).", bold_prefix="4.4 Privacy & CASL Accountability.")

    add_h1("5. OPERATIONAL JURISDICTIONS & ASYMMETRIC PROVINCIAL EXPANSION")
    add_p(" \"Authorized Brokerage Jurisdictions\" means British Columbia and Alberta as of the Effective Date, plus any additional Canadian province or territory in which the Brokerage subsequently obtains an active corporate insurance agency licence. \"Producer Licensed Jurisdictions\" means British Columbia as of the Effective Date, plus any additional Canadian province or territory in which the Producer subsequently obtains an active individual insurance licence.", bold_prefix="5.1 Definitions of Operational Jurisdictions.")
    add_p(" The Parties acknowledge that the Brokerage and the Producer may expand into additional Canadian jurisdictions at different times. Inquiries received through the Platform shall be handled and compensated according to three jurisdictional tiers:", bold_prefix="5.2 Three-Tier Jurisdictional Routing.")
    add_bullet(" Where both the Brokerage and the Producer hold active licences in the province where the applicant business or risk is situated, the deal shall be handled directly by the Producer (under Level 1 supervision or with Level 2 independent authority) and compensated under Stream A of Schedule A.", bold_prefix="(a) Tier 1 - Both Brokerage & Producer Licensed (Stream A):")
    add_bullet(" Where the Brokerage holds an agency licence in the province but the Producer is not yet individually licensed, the deal shall be routed internally to an appropriately licensed Nexus broker. The deal remains tagged as CB-WEB and is compensated under Stream B of Schedule A.", bold_prefix="(b) Tier 2 - Brokerage Licensed, Producer Not Yet Licensed (Stream B):")
    add_bullet(" Where the Brokerage does not hold an agency licence in the target province, the deal shall be referred by the Brokerage to an independent licensed partner brokerage in that jurisdiction pursuant to a written inter-brokerage referral agreement. The corporate referral revenue collected by the Brokerage shall be compensated under Stream C of Schedule A.", bold_prefix="(c) Tier 3 - Brokerage Not Licensed (Stream C Interprovincial Referral):")

    add_h1("6. PLATFORM INFRASTRUCTURE & MARKETING EXPENSE STRUCTURE")
    add_p(" Effective upon the Effective Date, the Brokerage shall directly assume, pay, and fund one hundred percent (100%) of all baseline fixed overhead operating expenses and pre-approved variable marketing costs of the Platform using pre-tax corporate funds, as follows:", bold_prefix="6.1 Direct Corporate Payment & Expense Thresholds.")
    add_bullet(" One hundred percent (100%) of domain registration fees, CIRA renewal fees, and DNS routing management fees for contractbonding.ca;", bold_prefix="(a) Baseline Domain & DNS Overhead:")
    add_bullet(" One hundred percent (100%) of web hosting infrastructure, cloud application hosting, database hosting services, source code repository fees, SSL certificates, and transactional email service subscriptions;", bold_prefix="(b) Baseline Hosting & Database Overhead:")
    add_bullet(" One hundred percent (100%) of British Columbia, Alberta, and any future provincial Corporate Registry trade name / DBA filing fees and Insurance Council trade name registration fees for contractbonding.ca;", bold_prefix="(c) Regulatory & DBA Filings:")
    add_bullet(" One hundred percent (100%) of Errors & Omissions (E&O) insurance endorsements and corporate insurance premiums covering the operations of contractbonding.ca; and", bold_prefix="(d) E&O Endorsements:")
    add_bullet(" Up to two thousand dollars ($2,000.00 CAD) per calendar month in variable digital advertising, Google Ads paid search, SEO development, landing-page expansion, AI tool subscriptions, and AI token/compute expenses without requiring prior written approval from the Brokerage. Any variable monthly spend in excess of $2,000.00 CAD shall require prior written approval from the Brokerage's President or Nominee.", bold_prefix="(e) Variable Marketing & AI Expense Envelope ($2,000/mo Pre-Approved):")
    add_p(" In no event shall the Producer be required to fund, pay out-of-pocket, or personally reimburse any Platform infrastructure, hosting, advertising, or regulatory costs. All approved expenses shall be billed directly to corporate accounts or credit cards of the Brokerage.", bold_prefix="6.2 Zero Personal Producer Expense Obligation.")
    add_p(" The Brokerage shall maintain a distinct tracking source code (\"CB-WEB\") in its accounting and CRM systems for all revenue generated from (i) inbound inquiries via contractbonding.ca and (ii) outbound campaigns and deals originated by the Producer using prospect lists, exports, or procurement intelligence from Excluded Personal IP (Schedule B, including The Intelligence Tool). All deals tagged CB-WEB shall be compensated in accordance with Schedule A.", bold_prefix="6.3 Dedicated Commission Tracking (\"CB-WEB\" Book Definition).")
    add_p(" The Producer shall maintain all Excluded Personal IP (Schedule B, including The Intelligence Tool) on separate personal accounts and compute infrastructure outside the Platform billing stack. Any incidental corporate reimbursement of third-party data lookup fees requested for Brokerage business confers zero ownership or licensing rights over any Excluded Personal IP.", bold_prefix="6.4 Separate Infrastructure for Excluded Personal IP.")

    add_h1("7. TERM, TERMINATION, DEPARTURE PROTECTIONS & BOOK BUYOUT")
    add_p(" This Addendum commences on the Effective Date and continues in full force and effect for so long as the Producer remains actively licensed with and sponsored by the Brokerage, unless earlier terminated in accordance with Section 7.2.", bold_prefix="7.1 Term.")
    add_p(" The License granted to the Brokerage under Section 2 terminates automatically upon the occurrence of any of the following events (each, a \"Termination Event\"): ", bold_prefix="7.2 Termination Triggers.")
    add_bullet(" Termination of the Producer's employment or sponsorship by the Brokerage without just cause (upon ninety (90) days' advance written notice);", bold_prefix="(a) Without Just Cause:")
    add_bullet(" Voluntary resignation or departure by the Producer (upon thirty (30) days' advance written notice, or upon transferring the Producer's licence to another brokerage);", bold_prefix="(b) Voluntary Resignation:")
    add_bullet(" Termination of the Producer's employment for just cause by the Brokerage (or immediate termination if required by an insurance regulatory authority); or", bold_prefix="(c) With Just Cause / Regulatory Revocation:")
    add_bullet(" A Change of Control, sale of all or substantially all shares or assets of the Brokerage, corporate dissolution, loss of agency licence, or a material uncured default by the Brokerage in paying Schedule A commissions for more than forty-five (45) days following written notice.", bold_prefix="(d) Sale, Change of Control, Wind-Down, or Payment Default:")
    add_p(" Upon any Termination Event under Section 7.2(a) through (d), the License terminates immediately and does not transfer to any corporate acquirer, buyer, or successor. Chase Pierce Addison immediately retains 100% full, exclusive legal and beneficial ownership, DNS control, hosting access, and operational control over contractbonding.ca and the Platform codebase. To ensure orderly continuity for policyholders without compromising the Producer's ownership, the Parties agree that during a thirty (30) calendar day post-termination transition window following the termination date, contractbonding.ca will display a neutral, professional transitional notice directing existing Nexus surety clients to Nexus Insurance Brokers Ltd.'s main telephone and email channels for ongoing policy servicing, before the Producer redirects or relaunches the domain.", bold_prefix="7.3 Asset Reversion & 30-Day Wind-Down Notice Window.")
    add_p(" The Parties expressly distinguish between (i) the Platform technology (contractbonding.ca domain, database architecture, and codebase, which Chase Pierce Addison retains in full), (ii) Excluded Personal IP (Schedule B, which Chase Pierce Addison retains completely outside this Addendum), and (iii) the bound accounts and recurring client book tagged CB-WEB (as defined in Section 6.3), which remain on the Brokerage's books or are acquired in an M&A transaction. Upon any Termination Event under Section 7.2(a), (b), (c), or (d) where the Brokerage (or an M&A buyer) retains the bound CB-WEB accounts:", bold_prefix="7.4 Deal & Book-of-Business Buyout Payout.")
    add_bullet(" In addition to retaining full ownership of the Platform, the Producer shall be unconditionally entitled to receive a dedicated Deal / Book-of-Business Buyout Payout payable upon any Termination Event under Section 7.2(a), (b), (c), or (d), regardless of the reason for departure. The Parties expressly agree that this payout constitutes bona fide commercial consideration for the transfer and permanent retention by the Brokerage of the commercial goodwill, client relationships, renewal rights, and bound accounts originated through the Producer's proprietary Platform and Excluded Personal IP, and does not constitute severance, a penalty, or liquidated damages. The buyout payout is calculated as follows (plus any unpaid earned commissions accrued prior to termination):", bold_prefix="(a) Dual Entitlement & Valuation Formula:")
    add_p("Upon an internal departure under Section 7.2(a), (b), or (c), the buyout payout shall equal exactly four point five times (4.5x) the trailing twelve (12) months' gross annual commission and net referral revenue generated by the entire CB-WEB book (as defined in Section 6.3). This calculation is based on the unadjusted gross commission revenue of the book, without normalization deductions for project-specific surety bonds or one-off placements. (The 4.5x multiple reflects an agreed twenty-five percent (25%) discount to the Brokerage's benchmark ~6.0x valuation multiple); OR", bold_prefix="(i) Internal Departure Buyout Formula (Fixed 4.5x Multiple): ")
    add_p("Upon a Change of Control, share sale, or asset sale under Section 7.2(d), the buyout payout shall equal the greater of: (A) four point five times (4.5x) the trailing twelve (12) months' gross annual commission and net referral revenue of the CB-WEB book; OR (B) seventy-five percent (75%) of the actual headline gross commission-revenue valuation multiple paid by the third-party buyer for the Brokerage's business applied to the CB-WEB trailing twelve (12) month gross revenue.", bold_prefix="(ii) Third-Party Sale / M&A Upside Ratchet: ")
    add_bullet(" Upon departure under Section 7.2(a) or (b) to another licensed Canadian insurance brokerage, in lieu of the cash buyout payout, the Producer may elect in writing (subject to client consent and insurer appointments) to have the Brokerage execute standard Broker of Record transfer authorizations transferring servicing of the CB-WEB client book to the Producer's new brokerage without monetary penalty or offset;", bold_prefix="(b) Optional Client Book Transfer Election:")
    add_bullet(" The buyout payout under this Section is completely separate from, independent of, and in addition to (and shall not be credited against or offset by) any other payout, equity sale proceeds, shareholder distribution, retention bonus, earn-out, severance payment, or earned commissions that the Producer may receive; and", bold_prefix="(c) Separate & Non-Offsetting Payout:")
    add_bullet(" Payment timing shall be governed strictly as follows:", bold_prefix="(d) Payment Mechanics & Installment Option:")
    add_p("In the event of a Third-Party Sale or Change of Control under Section 7.2(d), the buyout payout shall be paid one hundred percent (100%) in full in cash at the closing of the transaction, prior to and senior to any distributions to shareholders of the Brokerage.", bold_prefix="(i) Third-Party Sale Timing: ")
    add_p("In the event of an Internal Departure under Section 7.2(a), (b), or (c), the Brokerage shall have the option, exercisable by written notice within ten (10) business days following the departure date, to pay the buyout payout either: (A) in a single lump sum in cash within thirty (30) calendar days following departure; OR (B) in four (4) equal quarterly installments of twenty-five percent (25%) each over a twelve (12) month period. The first installment shall be due within thirty (30) calendar days following departure, with subsequent installments due on the first business day following each three (3) month anniversary thereof. If the Brokerage defaults on any installment payment, or upon any subsequent Change of Control or sale of the Brokerage, the entire remaining unpaid balance of the buyout payout shall accelerate immediately and become due and payable in full, bearing interest at the Bank of Canada prime rate plus two percent (2%) per annum from the date of default until paid in full.", bold_prefix="(ii) Internal Departure Installment Option: ")
    add_p(" Sections 1.5, 1.6, 3 (including 3.3 and 3.4), 7.3, 7.4, 8, and Schedule B survive the termination of this Addendum and are binding upon the Brokerage's successors, purchasers, and assigns.", bold_prefix="7.5 Survival.")

    add_h1("8. GENERAL PROVISIONS & PROTECTIVE BOILERPLATE")
    add_p(" This Addendum is governed by and construed in accordance with the laws of the Province of British Columbia and the federal laws of Canada applicable therein.", bold_prefix="8.1 Governing Law.")
    add_p(" The Parties establish the following balanced indemnification standards:", bold_prefix="8.2 Mutual Indemnification.")
    add_bullet(" The Producer shall indemnify, defend, and hold harmless the Brokerage, its directors, officers, and employees from and against any direct damages, losses, and reasonable legal expenses awarded by a court of competent jurisdiction arising solely from a third-party claim that The Source Code (excluding third-party open-source components and Brokerage content) infringes the Canadian copyright of such third party.", bold_prefix="(a) Producer IP Indemnity:")
    add_bullet(" The Brokerage shall indemnify, defend, and hold harmless the Producer from and against any and all claims, demands, regulatory proceedings, fines, penalties, Errors & Omissions liabilities, policyholder disputes, advertising liabilities, and legal expenses arising out of or connected with the Brokerage's operation of the Platform, the marketing or underwriting of insurance or surety bonds, client data custody, or regulatory compliance under the Financial Institutions Act or PIPA.", bold_prefix="(b) Brokerage Operations Indemnity:")
    add_p(" If any provision of this Addendum (including the Stream C bonus mechanics or any specific buyout installment term) is held to be invalid, illegal, or unenforceable by an arbitrator or court of competent jurisdiction or by an insurance regulator, such provision shall be severed or modified to the minimum extent necessary to make it valid and enforceable, and all remaining provisions, including the Producer's absolute ownership of the Platform (Section 3) and all remaining financial entitlements under Section 7.4 and Schedule A, shall remain in full force and effect.", bold_prefix="8.3 Severability & Blue-Pencil Reformation.")
    add_p(" Any dispute, controversy, or claim arising out of or relating to this Addendum, including its formation, validity, interpretation, breach, or termination, shall be resolved exclusively by confidential, binding single-arbitrator arbitration seated in Burnaby or Vancouver, British Columbia, administered by the Vancouver International Arbitration Centre (VanIAC) pursuant to its Domestic Arbitration Rules and the Arbitration Act (British Columbia), SBC 2020, c. 2. The decision of the arbitrator shall be final, binding, and non-appealable, and judgment upon the award may be entered in any court having jurisdiction.", bold_prefix="8.4 Confidential Binding Arbitration.")
    add_p(" This Addendum, together with Schedules A and B, constitutes the entire agreement between the Parties pertaining to its subject matter and supersedes all prior agreements, understandings, negotiations, and discussions, whether oral or written, between the Parties regarding the Platform, including the Producer's legacy employment agreement to the extent of any conflict.", bold_prefix="8.5 Entire Agreement.")
    add_p(" No amendment, modification, or waiver of any provision of this Addendum shall be binding unless executed in writing by both Parties.", bold_prefix="8.6 Amendments in Writing.")
    add_p(" This Addendum enures to the benefit of and is binding upon the Parties and their respective heirs, executors, administrators, successors, and permitted assigns.", bold_prefix="8.7 Enurement.")

    # Schedule A
    doc.add_page_break()
    add_title("SCHEDULE A")
    add_subtitle("THREE-TIER PRODUCER COMMISSION & REFERRAL SPLIT STRUCTURE")
    add_p("All deals tagged \"CB-WEB\" - including (i) inbound leads generated through contractbonding.ca and (ii) outbound campaigns and deals originated by the Producer using data exported from Excluded Personal IP (Schedule B, including The Intelligence Tool) or marketed under the contractbonding.ca brand - are categorized into one of three revenue streams paid to the Producer through the Brokerage's regular commission payroll:")

    # Table for Schedule A
    table = doc.add_table(rows=4, cols=5)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    col_widths = [Inches(1.2), Inches(1.8), Inches(1.2), Inches(1.0), Inches(1.8)]
    for row in table.rows:
        for j, cell in enumerate(row.cells):
            cell.width = col_widths[j]
            set_cell_margins(cell, top=100, bottom=100, left=120, right=120)

    # Header Row
    headers = ["Revenue Stream", "Description of Business", "Producer Share", "Brokerage Share", "Notes & Regulatory Conditions"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        set_cell_background(cell, "0F2B5C")
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(h)
        run.bold = True
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    # Data Rows
    rows_data = [
        (
            "Stream A: Producer-Worked Business",
            "Surety bonds and cross-sold Commercial Insurance (CGL, Builders Risk, Equipment, Commercial Auto) originated and actively worked on by the Producer in a jurisdiction where both the Brokerage and Producer are licensed (under Level 1 supervision initially, and with expanded capacity upon Level 2 licensing).",
            "Year 1 (New): 65% of gross brokerage commission\n\nYear 2 & Renewals: 35% of gross brokerage commission",
            "Year 1: 35%\n\nYear 2 & Renewals: 65%",
            "While Level 1, a licensed Level 2 or 3 intermediary signs and executes all bonds (Rule 6(1)(a)). Upon achieving Level 2 and Power of Attorney appointments, Producer executes bonds directly."
        ),
        (
            "Stream B: Complex Handoff or Brokerage-Only Jurisdiction",
            "Complex surety accounts outside Producer's current capacity, or leads in an Authorized Brokerage Jurisdiction where the Producer is not yet individually licensed, handed off internally to another Nexus broker.",
            "Year 1 (New): 35% of gross brokerage commission\n\nRenewals (Not Working): 15% of gross commission\n\nRenewals (Working on Deal): 35% of gross commission",
            "Balance split between Servicing Broker and Brokerage house",
            "Applies to surety bonds and cross-sold commercial policies. The Producer qualifies for the 35% active-servicing renewal split whenever the Producer is appropriately licensed in the jurisdiction and performs substantive client contact or file work during the renewal cycle (including client check-ins, gathering updated financial statements or work-on-hand schedules, reviewing bond facility terms, or coordinating renewal submission details)."
        ),
        (
            "Stream C: Platform Lead Origination in Non-Licensed Brokerage Jurisdictions",
            "Inquiries received through the Platform in Canadian provinces or territories where the Brokerage does not hold a general insurance agency licence, referred to an external licensed partner brokerage under an inter-brokerage referral agreement.",
            "Formulaic Origination & Marketing Bonus equal to ninety percent (90%) of the net corporate referral revenue actually collected by Nexus Insurance Brokers Ltd.",
            "Ten percent (10%) of net corporate referral revenue retained as administrative handling fee",
            "Paid to the Producer through payroll as an origination and marketing bonus for digital lead generation, SEO marketing, and platform origination services. The Producer's activities are strictly confined to non-solicitation platform lead origination, in full compliance with Canadian interprovincial rules against unlicensed commission splitting."
        )
    ]

    for i, data in enumerate(rows_data):
        row = table.rows[i+1]
        for j, text in enumerate(data):
            cell = row.cells[j]
            bg_color = "F7F9FB" if i % 2 == 0 else "FFFFFF"
            set_cell_background(cell, bg_color)
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.1
            p.paragraph_format.space_after = Pt(2)
            run = p.add_run(text)
            run.font.size = Pt(9)
            if j == 0:
                run.bold = True

    add_p("")
    add_p("Commissions and referral bonus shares are payable on the Brokerage's regular monthly commission cycle following receipt of cleared insurer commission or partner brokerage referral funds, subject to statutory payroll/tax deductions or T4A reporting as applicable.", bold_prefix="Payment Timing: ")
    add_h2("Guaranteed Minimum Commission Floor & Upward Escalation (\"Greater-Of\" Rule)")
    add_p("The commission percentages set out in Schedule A above represent a guaranteed contractual minimum floor for the Producer on all CB-WEB business:")
    add_bullet(" If at any time the Brokerage's general producer compensation schedule or the Producer's commission structure for work performed at Nexus Insurance Brokers Ltd. outside of contractbonding.ca is amended to provide the Producer with a higher commission percentage on any corresponding category of new business, renewal business, internal handoff, or referral, then Streams A, B, and/or C under this Addendum shall automatically increase to reflect that higher percentage for all new and renewing transactions going forward.", bold_prefix="(a) Upward Adjustment: ")
    add_bullet(" Conversely, if the Brokerage's general commission structure for work outside of contractbonding.ca is ever reduced or modified such that the Producer would earn a lower commission percentage than the rates listed in Schedule A, this Addendum shall prevail and stand unchanged, ensuring the Producer always receives the greater of (i) the applicable Schedule A rate above or (ii) the Producer's applicable general Nexus commission split.", bold_prefix="(b) No Downward Reduction (Floor Protection): ")

    # Schedule B
    doc.add_page_break()
    add_title("SCHEDULE B")
    add_subtitle("EXCLUDED PERSONAL IP & BACKGROUND TOOLS")
    add_p("Pursuant to Sections 1.1 and 3.4, the following software, repositories, databases, and personal projects are expressly excluded from the Platform License and remain the sole, unencumbered personal property of Chase Pierce Addison:")
    add_p("Personal public procurement data collector, daily RFP/BC Bid scraper, relational database, and analytical toolset (used strictly as a personal upstream intelligence source via CSV/query export to originate CB-WEB outbound prospects).", bold_prefix="1. The Intelligence Tool (https://github.com/SwimmerPierce/BC_Bid_Organizer_Skill): ")
    add_p("All custom AI skills, scripts, research automations, and local workflows maintained by Chase Pierce Addison (including AI-Skills-Backup, workspace/knowledge architecture frameworks, and copywriting/analysis utilities).", bold_prefix="2. Personal AI Agent Skills & Developer Workflows: ")
    add_p("Any and all past, present, and future GitHub repositories, web apps, tools, or side projects under the SwimmerPierce account (or any future personal account) other than The Source Code.", bold_prefix="3. All Other Personal Repositories Under SwimmerPierce: ")
    add_p("Chase Pierce Addison may run, modify, host, commercialize, or use any Schedule B asset independently outside of Nexus Insurance Brokers Ltd., provided no confidential Brokerage client underwriting files or PIPA-protected personal client information belonging to Nexus are exported into or exposed through Schedule B tools.", bold_prefix="4. Permitted Decoupled Use: ")

    # Execution & Signatures
    doc.add_page_break()
    add_title("EXECUTION & SIGNATURES")
    add_p("IN WITNESS WHEREOF the Parties hereto have executed this Addendum as of the Effective Date first written above.")

    sig_table = doc.add_table(rows=2, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.autofit = False

    sig_widths = [Inches(3.4), Inches(3.4)]
    for row in sig_table.rows:
        for j, cell in enumerate(row.cells):
            cell.width = sig_widths[j]
            set_cell_margins(cell, top=140, bottom=140, left=140, right=140)

    # Cell 0,0: Producer
    c00 = sig_table.cell(0, 0)
    set_cell_background(c00, "FAFAFA")
    p00 = c00.paragraphs[0]
    p00.add_run("PRODUCER / LICENSOR:\n\n").bold = True
    p00.add_run("Signature: _________________________________\n\n")
    p00.add_run("Name: Chase Pierce Addison\n")
    p00.add_run("Title: Licensor & Insurance Producer\n")
    p00.add_run("Date: _____________________________________")

    # Cell 0,1: Ken Addison (President)
    c01 = sig_table.cell(0, 1)
    set_cell_background(c01, "FAFAFA")
    p01 = c01.paragraphs[0]
    p01.add_run("BROKERAGE (NEXUS INSURANCE BROKERS LTD.):\n\n").bold = True
    p01.add_run("Signature: _________________________________\n\n")
    p01.add_run("Name: Kenneth James Addison\n")
    p01.add_run("Title: President, Nominee & 90% Voting Shareholder\n")
    p01.add_run("Date: _____________________________________")

    # Cell 1,0: Explanatory note
    c10 = sig_table.cell(1, 0)
    set_cell_background(c10, "F0F4F8")
    p10 = c10.paragraphs[0]
    p10.add_run("CORPORATE RATIFICATION NOTE:\n").bold = True
    r = p10.add_run("Executed by 100% of the voting shareholders of Nexus Insurance Brokers Ltd. to satisfy BCBCA ss. 147-149 and waive all conflict and oppression claims.")
    r.font.size = Pt(8.5)
    r.italic = True

    # Cell 1,1: Minority Shareholder / VP
    c11 = sig_table.cell(1, 1)
    set_cell_background(c11, "FAFAFA")
    p11 = c11.paragraphs[0]
    p11.add_run("MINORITY SHAREHOLDER & OFFICER RATIFICATION:\n\n").bold = True
    p11.add_run("Signature: _________________________________\n\n")
    p11.add_run("Name: [NAME OF MINORITY SHAREHOLDER / VP]\n")
    p11.add_run("Title: Vice President & Minority Voting Shareholder\n")
    p11.add_run("Date: _____________________________________")

    doc.save("DOMAIN & PLATFORM LICENSE AND PRODUCER COMMISSION ADDENDUM (Execution Ready).docx")
    print("Execution ready document created successfully.")

if __name__ == "__main__":
    create_execution_ready_document()
