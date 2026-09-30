const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const articlesPath = path.join(__dirname, '..', 'data', 'articles.json');
const rawArticles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

function generateOid() {
  return crypto.randomBytes(12).toString('hex');
}

const newUsArticles = [
  {
    _id: { $oid: generateOid() },
    slug: 'us-senate-bipartisan-critical-minerals-domestic-refining-security-act-2026',
    title: 'U.S. Senate Passes Landmark Bipartisan Critical Minerals Independence and Domestic Refining Security Act',
    deck: 'Lawmakers approve $75 billion in federal loan guarantees and tax credits to accelerate domestic extraction, chemical refining, and recycling of rare-earth elements essential for defense and energy security.',
    image: '/assets/upload/news/news-us-senate-critical-minerals-refining-act-2026.webp',
    tag: 'US POLITICS',
    tagColor: 'red',
    author: 'Carlos Mendoza Reyes',
    authorRole: 'Politics Reporter',
    authorAvatar: '/assets/upload/authors/carlos-mendoza-reyes.webp',
    time: '29/09/2026',
    readTime: '7 min',
    comments: 0,
    category: 'politics',
    breadcrumbCategory: 'Politics',
    tagLabel: 'US POLITICS',
    headline: 'U.S. Senate Passes Landmark Bipartisan Critical Minerals Independence and Domestic Refining Security Act',
    standfirst: 'Lawmakers approve $75 billion in federal loan guarantees and tax credits to accelerate domestic extraction, chemical refining, and recycling of rare-earth elements essential for defense and energy security.',
    caption: 'U.S. senators deliberate during the final vote on the Critical Minerals Independence and Domestic Refining Security Act at the Capitol in Washington.',
    body: [
      "<p><strong>Washington, D.C.:</strong> In a decisive bipartisan vote of 78 to 22, the United States Senate has passed the Critical Minerals Independence and Domestic Refining Security Act of 2026, marking the most aggressive legislative push in decades to establish end-to-end supply chain autonomy for essential raw materials.</p>",
      "<p>The comprehensive $75 billion legislative package authorizes targeted capital expenditures, federal loan guarantees, and extended Section 45X production tax credits aimed at scaling domestic extraction, chemical separation, and advanced metallurgic processing of lithium, nickel, cobalt, gallium, and heavy rare-earth elements across North America.</p>",
      "<h4>Fast-Tracking Permitting and Strategic Reserves</h4>",
      "<p>For over a decade, American manufacturing and national defense sectors have remained acutely dependent on foreign supply chains, with over eighty percent of refined rare-earth oxides processed abroad. The newly enacted statute institutes a streamlined 180-day interagency permitting process for critical processing facilities and establishes the National Strategic Critical Mineral Reserve under the joint supervision of the Department of Energy and the Department of Defense.</p>",
      "<p>\"We can no longer afford to design leading-edge defense technologies, advanced battery systems, and semiconductor components that depend entirely on vulnerable foreign supply chokepoints,\" remarked the Senate Majority Leader during the post-vote press briefing. \"This legislation establishes genuine industrial resilience by ensuring that American refineries, chemists, and metallurgical engineers process the materials that power our national security and economic future.\"</p>",
      "<p>Under the bill’s provisions, federal procurement regulations will mandate that all microelectronics, aerospace alloys, and grid-scale energy storage systems acquired by government agencies utilize minerals processed exclusively in allied nations by 2028.</p>",
      "<h4>Catalyzing Private Capital and Regional Economic Growth</h4>",
      "<p>The legislative breakthrough was met with strong enthusiasm across domestic mining and chemical manufacturing corridors. Private investment funds and sovereign wealth partners have already outlined more than $40 billion in complementary private capital commitments for refining hubs across Wyoming, Nevada, North Carolina, and the Iron Range in Minnesota.</p>",
      "<p>\"Securing predictable multi-year tax incentives and accelerated environmental review protocols removes the primary impediments that have historically deterred private capital from investing in capital-intensive hydrometallurgical processing assets,\" noted the Chief Policy Analyst at the National Mining Association. \"This bill provides the regulatory certainty necessary to build commercially competitive refining capacity on American soil.\"</p>",
      "<h4>Bipartisan Compromise and Environmental Safeguards</h4>",
      "<p>The bill’s final text incorporated robust closed-loop environmental safeguards championed by lawmakers from both parties. A dedicated $10 billion allocation will finance state-of-the-art closed-loop industrial water recycling systems, dry-stack tailings management, and commercial-scale e-waste mineral reclamation facilities to minimize ecological disruption.</p>",
      "<p>Following tonight’s Senate passage, the legislation advances to the House of Representatives for final reconciliation, with congressional leadership indicating the measure will reach the President's desk for signature before the close of the current legislative session.</p>"
    ],
    tags: [
      '#USPolitics',
      '#CriticalMinerals',
      '#SupplyChain',
      '#NationalSecurity',
      '#Senate',
      '#FinancialJournal'
    ],
    related: [],
    status: 'Published',
    views: 0,
    isBreaking: true,
    isFeatured: true,
    publishedDate: '2026-09-29T22:30:00.000Z',
    metaTitle: 'US Senate Passes $75B Critical Minerals Security Act 2026',
    metaDescription: 'The U.S. Senate passes bipartisan legislation allocating $75 billion to secure domestic critical mineral refining and strategic supply chains.',
    targetKeyword: 'US Senate critical minerals act 2026, domestic rare earth refining, strategic mineral reserve, bipartisan supply chain security, Financial Journal US politics',
    canonicalUrl: 'https://www.financial-journal.xyz/politics/us-senate-bipartisan-critical-minerals-domestic-refining-security-act-2026',
    isOpinion: false,
    categorySlug: 'politics'
  },
  {
    _id: { $oid: generateOid() },
    slug: 'fed-treasury-non-bank-financial-liquidity-modernization-framework-2026',
    title: 'Federal Reserve and Treasury Unveil Comprehensive Liquidity Modernization Framework for Non-Bank Financial Intermediaries',
    deck: 'Financial regulators introduce automated standing repo facilities, standardized margin haircuts, and direct oversight protocols to mitigate systemic contagion across private credit and private equity markets.',
    image: '/assets/upload/news/news-fed-treasury-nonbank-liquidity-framework-2026.webp',
    tag: 'US ECONOMY',
    tagColor: 'blue',
    author: 'Elena Morales Vega',
    authorRole: 'Economy Editor',
    authorAvatar: '/assets/upload/authors/elena-morales-vega.webp',
    time: '29/09/2026',
    readTime: '6 min',
    comments: 0,
    category: 'economy',
    breadcrumbCategory: 'Economy',
    tagLabel: 'US ECONOMY',
    headline: 'Federal Reserve and Treasury Unveil Comprehensive Liquidity Modernization Framework for Non-Bank Financial Intermediaries',
    standfirst: 'Financial regulators introduce automated standing repo facilities, standardized margin haircuts, and direct oversight protocols to mitigate systemic contagion across private credit and private equity markets.',
    caption: 'Officials from the Federal Reserve and the U.S. Department of the Treasury convene in Washington to present the new non-bank financial stability framework.',
    body: [
      "<p><strong>Washington, D.C. / New York:</strong> In an unprecedented coordinated initiative to reinforce macroeconomic stability, the Federal Reserve Board of Governors alongside the U.S. Department of the Treasury has unveiled the Non-Bank Financial Intermediation Stability and Liquidity Framework.</p>",
      "<p>The comprehensive policy structure establishes new regulatory reporting mandates, centralized clearing requirements for private repo transactions, and pre-approved standing liquidity backstops designed to prevent sudden liquidity freezes across the rapidly expanding $3.2 trillion private credit and shadow banking sectors.</p>",
      "<h4>Closing Regulatory Gaps in Non-Bank Lending</h4>",
      "<p>Over the past five years, non-bank financial institutions, private debt funds, and institutional credit vehicles have evolved from niche alternative lenders into essential providers of corporate working capital, commercial real estate debt, and syndicated term loans. However, the lack of centralized clearing and standardized stress-testing protocols had raised systemic concerns regarding liquidity transformation risks during market stress periods.</p>",
      "<p>The newly unveiled framework introduces mandatory quarterly liquidity stress simulations for private debt funds managing more than $10 billion in regulatory assets under management. It also requires institutional lenders to maintain minimum levels of high-quality liquid assets (HQLA) calibrated to their short-term redemption exposure profiles.</p>",
      "<p>\"Our financial system has fundamentally transformed, with an increasing volume of corporate credit origination occurring outside the traditional depository banking perimeter,\" stated the Federal Reserve Chair during the joint announcement. \"This framework ensures that non-bank liquidity providers operate with transparent risk buffers, reducing the likelihood of forced asset firesales during bouts of market volatility.\"</p>",
      "<h4>Automated Standing Repo Access and Market Reaction</h4>",
      "<p>To guarantee liquidity transmission during turbulent conditions, the Federal Reserve will extend access to its Standing Repo Facility (SRF) to qualified primary non-bank broker-dealers and central counterparty clearinghouses that meet rigorous capitalization and governance criteria.</p>",
      "<p>Wall Street credit markets responded positively to the announcement, with investment-grade corporate bond yield spreads tightening four basis points across benchmark indices. Major asset managers welcomed the liquidity backstop, emphasizing that regulatory clarity removes uncertainty and institutionalizes private credit as a durable pillar of American capital allocation.</p>",
      "<h4>Phased Implementation and Global Alignment</h4>",
      "<p>The regulations will be phased in over three stages starting in the first quarter of 2027, with full compliance required by mid-2028. The Financial Stability Oversight Council (FSOC) will coordinate with international counterparts at the Bank for International Settlements to align cross-border reporting standards for multinational credit managers.</p>"
    ],
    tags: [
      '#USEconomy',
      '#FederalReserve',
      '#Treasury',
      '#PrivateCredit',
      '#FinancialStability',
      '#FinancialJournal'
    ],
    related: [],
    status: 'Published',
    views: 0,
    isBreaking: false,
    isFeatured: true,
    publishedDate: '2026-09-29T21:45:00.000Z',
    metaTitle: 'Fed & Treasury Unveil $3.2T Non-Bank Liquidity Framework 2026',
    metaDescription: 'Federal Reserve and Treasury introduce sweeping liquidity oversight rules and standing repo facilities for private credit and shadow banking.',
    targetKeyword: 'Federal Reserve non-bank liquidity framework 2026, private credit regulation, shadow banking stability, Treasury standing repo facility, Financial Journal economy',
    canonicalUrl: 'https://www.financial-journal.xyz/economy/fed-treasury-non-bank-financial-liquidity-modernization-framework-2026',
    isOpinion: false,
    categorySlug: 'economy'
  },
  {
    _id: { $oid: generateOid() },
    slug: 'us-commerce-department-expands-sub2nm-semiconductor-foundry-corridor-2026',
    title: 'U.S. Department of Commerce Expands National Semiconductor Foundry Hub with $45 Billion Sub-2nm Next-Gen Silicon Corridor',
    deck: 'Federal microelectronics subsidies and public-private manufacturing pacts accelerate High-NA extreme ultraviolet (EUV) chip fabrication facilities across Arizona, Ohio, and Texas.',
    image: '/assets/upload/news/news-us-sub2nm-semiconductor-foundry-corridor-2026.webp',
    tag: 'US TECHNOLOGY',
    tagColor: 'emerald',
    author: 'Diana Montoya Sierra',
    authorRole: 'Technology Correspondent',
    authorAvatar: '/assets/upload/authors/diana-montoya-sierra.webp',
    time: '29/09/2026',
    readTime: '6 min',
    comments: 0,
    category: 'technology',
    breadcrumbCategory: 'Technology',
    tagLabel: 'US TECHNOLOGY',
    headline: 'U.S. Department of Commerce Expands National Semiconductor Foundry Hub with $45 Billion Sub-2nm Next-Gen Silicon Corridor',
    standfirst: 'Federal microelectronics subsidies and public-private manufacturing pacts accelerate High-NA extreme ultraviolet (EUV) chip fabrication facilities across Arizona, Ohio, and Texas.',
    caption: 'Semiconductor cleanroom technicians calibrate next-generation High-NA EUV lithography systems at the advanced fabrication campus in Phoenix.',
    body: [
      "<p><strong>Phoenix / Washington:</strong> Accelerating the ongoing re-shoring of critical microelectronics manufacturing, the U.S. Department of Commerce has finalized $45 billion in expanded federal grants, commercial debt facilities, and advanced R&D consortia funding under the CHIPS and Science Implementation Strategy.</p>",
      "<p>The initiative establishes the American Next-Gen Silicon Manufacturing Corridor, directly supporting the commercial installation of sub-2nm fabrication nodes, High-NA extreme ultraviolet (EUV) photolithography scanners, and high-density 3D wafer-level advanced packaging facilities across Arizona, Texas, and Ohio.</p>",
      "<h4>Securing Sovereign AI and Supercomputing Silicon</h4>",
      "<p>As artificial intelligence foundation models and hyperscale cloud networks demand exponential increases in compute density and thermal efficiency, securing domestic access to cutting-edge semiconductor lithography has become an urgent strategic priority for both economic competitiveness and national defense.</p>",
      "<p>Under the new agreements, leading global foundry operators and domestic integrated device manufacturers will dedicate a minimum of forty percent of planned high-volume manufacturing lines in Columbus, Phoenix, and Sherman to domestic commercial AI accelerator and sovereign defense microelectronics contracts.</p>",
      "<p>\"American leadership in artificial intelligence and quantum computing cannot rest on fragile overseas fabrication ecosystems,\" stated the Secretary of Commerce during the formal announcement in Phoenix. \"Today’s commitments guarantee that the world’s most sophisticated sub-2nm transistors are not only designed in America, but manufactured and packaged by American workers in state-of-the-art domestic facilities.\"</p>",
      "<h4>Advanced Packaging and Chemical Ecosystems</h4>",
      "<p>A major focus of the expanded corridor strategy is addressing the domestic bottleneck in advanced semiconductor packaging. The federal allocation directs $12 billion specifically toward commercializing glass substrate packaging, chiplet integration standards, and silicon photonics interconnects.</p>",
      "<p>Additionally, thirty-five specialty chemical suppliers and substrate manufacturers have confirmed co-locating new purification and production plants adjacent to the primary fabrication clusters, creating over 22,000 high-skilled advanced manufacturing engineering jobs.</p>",
      "<h4>Workforce Development and University Partnerships</h4>",
      "<p>The federal framework mandates that $3 billion be channeled into regional microelectronics workforce development institutes. Partnering with twelve major state universities and technical colleges, the program will fund cleanroom apprenticeships, semiconductor engineering scholarships, and automated technician certification curriculums to meet the sector's long-term labor demand.</p>",
      "<p>Commercial pilot wafer production at the new Arizona and Ohio sub-2nm facilities is on track to begin initial qualification runs by late 2026, with full-scale high-volume manufacturing scheduled for mid-2027.</p>"
    ],
    tags: [
      '#USTechnology',
      '#Semiconductors',
      '#CHIPSAct',
      '#HighNAEUV',
      '#ArtificialIntelligence',
      '#FinancialJournal'
    ],
    related: [],
    status: 'Published',
    views: 0,
    isBreaking: false,
    isFeatured: true,
    publishedDate: '2026-09-29T20:30:00.000Z',
    metaTitle: 'US Commerce Department Expands $45B Sub-2nm Semiconductor Corridor 2026',
    metaDescription: 'U.S. Commerce Department finalizes $45B in CHIPS funding to deploy sub-2nm foundries and advanced packaging hubs across Arizona, Ohio, and Texas.',
    targetKeyword: 'US CHIPS Act sub-2nm foundry 2026, High-NA EUV silicon corridor, advanced semiconductor packaging, domestic AI microelectronics, Financial Journal tech',
    canonicalUrl: 'https://www.financial-journal.xyz/technology/us-commerce-department-expands-sub2nm-semiconductor-foundry-corridor-2026',
    isOpinion: false,
    categorySlug: 'technology'
  },
  {
    _id: { $oid: generateOid() },
    slug: 'us-department-of-energy-western-clean-hydrogen-pipeline-carbon-capture-2026',
    title: 'U.S. Department of Energy Grants Final Approvals for $38 Billion Western Clean Hydrogen Pipeline and Carbon Capture Network',
    deck: 'Federal regulators approve the inter-state clean energy transmission corridor connecting geothermal and solar production hubs across Nevada and Utah to industrial manufacturing centers in California and the Pacific Northwest.',
    image: '/assets/upload/news/news-us-doe-western-clean-hydrogen-pipeline-2026.webp',
    tag: 'US ENVIRONMENT',
    tagColor: 'green',
    author: 'Andrés Silva Vargas',
    authorRole: 'Environment Editor',
    authorAvatar: '/assets/upload/authors/andres-silva-vargas.webp',
    time: '29/09/2026',
    readTime: '6 min',
    comments: 0,
    category: 'environment',
    breadcrumbCategory: 'Environment',
    tagLabel: 'US ENVIRONMENT',
    headline: 'U.S. Department of Energy Grants Final Approvals for $38 Billion Western Clean Hydrogen Pipeline and Carbon Capture Network',
    standfirst: 'Federal regulators approve the inter-state clean energy transmission corridor connecting geothermal and solar production hubs across Nevada and Utah to industrial manufacturing centers in California and the Pacific Northwest.',
    caption: 'Energy engineers and pipeline construction managers conduct pressurized hydrostatic testing on the Western Clean Hydrogen Pipeline in Utah.',
    body: [
      "<p><strong>Salt Lake City / Washington:</strong> Culminating three years of comprehensive environmental impact assessments and inter-state regulatory reviews, the U.S. Department of Energy (DOE) has issued the final permits for the $38 Billion Western Clean Hydrogen and Carbon Sequestration Network.</p>",
      "<p>The historic infrastructure initiative spans over 1,800 miles of specialized hydrogen-compatible steel pipeline and geological saline aquifer carbon storage vaults, linking utility-scale green hydrogen electrolyzer complexes in Utah, Nevada, and Wyoming with heavy industrial manufacturing basins and deepwater maritime ports in California and Washington state.</p>",
      "<h4>Decarbonizing Heavy Industry and Long-Haul Logistics</h4>",
      "<p>While light-duty electric vehicle adoption continues to expand across consumer markets, decarbonizing hard-to-abate industrial sectors such as primary steel production, cement manufacturing, chemical refining, and long-haul freight has remained a persistent technical and economic challenge.</p>",
      "<p>The Western Network addresses this structural challenge by delivering pipeline-grade green hydrogen produced from dedicated geothermal and desert solar installations directly to industrial off-takers at an unsubsidized target price of $1.50 per kilogram by 2028.</p>",
      "<p>\"This project represents the practical blueprint for industrial decarbonization in the United States,\" remarked the Secretary of Energy during the signing ceremony in Salt Lake City. \"By leveraging the immense renewable potential of our Western public lands and linking it with cutting-edge pipeline infrastructure, we are lowering energy costs for American manufacturers while eliminating millions of tons of industrial carbon emissions annually.\"</p>",
      "<h4>Geological Storage and Carbon Capture Architecture</h4>",
      "<p>In parallel with the hydrogen distribution infrastructure, the project incorporates five deep subsurface geological carbon mineralization hubs capable of permanently sequestering up to 25 million metric tons of captured carbon dioxide per year in basalt formations and depleted oil and gas reservoirs.</p>",
      "<p>Over twelve major industrial manufacturing facilities along the corridor have contracted to connect their flue-gas carbon capture systems directly to the network, utilizing Section 45Q carbon capture tax credits to offset long-term operating costs.</p>",
      "<h4>Community Investment and Construction Timeline</h4>",
      "<p>Project developers have finalized binding Community Benefits Agreements committing over $1.5 billion toward local watershed restoration, rural education funding, and union labor apprentice programs. More than 16,000 union construction and pipefitting jobs will be created over the four-year buildout phase.</p>",
      "<p>Groundbreaking on the first pipeline segment between Delta, Utah, and the Mojave clean energy corridor is scheduled for November 2026, with commercial hydrogen transmission anticipated to commence by late 2027.</p>"
    ],
    tags: [
      '#USEnvironment',
      '#CleanHydrogen',
      '#CarbonCapture',
      '#EnergyTransition',
      '#Infrastructure',
      '#FinancialJournal'
    ],
    related: [],
    status: 'Published',
    views: 0,
    isBreaking: false,
    isFeatured: true,
    publishedDate: '2026-09-29T19:15:00.000Z',
    metaTitle: 'US DOE Approves $38B Western Clean Hydrogen Pipeline 2026',
    metaDescription: 'U.S. Department of Energy grants final approval for a 1,800-mile clean hydrogen pipeline and carbon sequestration corridor in the American West.',
    targetKeyword: 'US clean hydrogen pipeline 2026, Western green hydrogen network, carbon capture sequestration DOE, industrial decarbonization infrastructure, Financial Journal environment',
    canonicalUrl: 'https://www.financial-journal.xyz/environment/us-department-of-energy-western-clean-hydrogen-pipeline-carbon-capture-2026',
    isOpinion: false,
    categorySlug: 'environment'
  }
];

// Check character counts
newUsArticles.forEach((art, index) => {
  const fullText = art.body.join(' ').replace(/<[^>]+>/g, '');
  console.log(`US Article ${index + 1} [${art.category}]: ${fullText.length} characters | "${art.title}"`);
  if (fullText.length < 2000) {
    throw new Error(`US Article ${index + 1} has less than 2000 characters (${fullText.length})`);
  }
});

// Prepend new articles to existing articles
const updatedArticles = [...newUsArticles, ...rawArticles];
fs.writeFileSync(articlesPath, JSON.stringify(updatedArticles, null, 2), 'utf-8');
console.log(`Successfully added ${newUsArticles.length} new US articles to ${articlesPath}. Total articles: ${updatedArticles.length}`);
