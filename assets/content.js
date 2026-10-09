/*
  BUNDLED WEBSITE CONTENT (fallback copy of the Google Sheet)

  The live site reads the Google Sheet configured in assets/sheet-config.js.
  This file is used when the Sheet is disabled or unreachable, so keep it
  roughly in step with the Sheet. Everything after the equals sign must stay
  valid JSON: double quotes, no trailing commas, no comments.
*/
window.SITE_CONTENT = {
  "profile": {
    "name": "Harsh Sharma",
    "title": "PhD candidate, Department of Physics, IIT Bombay",
    "bio": "I work in quantum information theory with [Prof. Himadri Shekhar Dhar](https://www.phy.iitb.ac.in/employee-profile/himadri-shekhar-dhar), on collective spin systems: ensembles of spins, often coupled to a cavity, whose individual spins usually cannot be addressed.\nMy main project develops error-correcting codes for such ensembles that need only collective measurement and control, with applications to quantum memories and loss-tolerant sensing. I have also studied how parametric driving protects information stored in a spin–cavity system, thermodynamic probes of multipartite entanglement in strongly interacting systems, and collective power enhancement in quantum batteries.",
    "availability": "I expect to complete my PhD in July 2027 and am looking for postdoctoral and research positions in quantum error correction and quantum sensing.",
    "email": "harsh.sharma@iitb.ac.in",
    "address": "Department of Physics, IIT Bombay, Powai, Mumbai 400076, India",
    "photo": "assets/harsh-sharma.jpg",
    "cv": "",
    "scholar": "https://scholar.google.com/citations?user=EXCrXG0AAAAJ&hl=en",
    "arxiv": "https://arxiv.org/a/sharma_h_2.html",
    "orcid": "https://orcid.org/0000-0003-0136-2655",
    "linkedin": "https://www.linkedin.com/in/harshsharma0810",
    "github": ""
  },
  "publications": [
    {
      "arxiv": "arXiv:2408.11628",
      "title": "Quantum error correction for an unresolvable spin ensemble",
      "authors": "Harsh Sharma, Himadri Shekhar Dhar, Hoi-Kwan Lau",
      "journal": "Phys. Rev. A 114, 032414 (2026)",
      "doi": "10.1103/1fm4-32my",
      "summary": "Error-correcting codes for spin ensembles whose spins cannot be individually addressed. Information is stored in permutation-invariant states, and errors from individual and collective dephasing, decay, and pumping are corrected using only collective measurement and control. We apply the scheme to quantum memories and to loss-tolerant sensing."
    },
    {
      "arxiv": "arXiv:2512.15607",
      "title": "Quadratic power enhancement in extended Dicke quantum battery",
      "authors": "Harsh Sharma, Himadri Shekhar Dhar",
      "journal": "",
      "doi": "",
      "summary": "A quantum battery of N two-level systems coupled to two cavity modes, one of them in the dispersive regime. Quantum correlations and the speed of evolution both scale as N², which gives a quadratic enhancement in charging power."
    },
    {
      "arxiv": "arXiv:2511.03266",
      "title": "Thermodynamic Probes of Multipartite Entanglement in Strongly Interacting Quantum Systems",
      "authors": "Harsh Sharma, Sampriti Saha, A. S. Majumdar, Manik Banik, Himadri Shekhar Dhar",
      "journal": "",
      "doi": "",
      "summary": "We use global and local ergotropy, the maximum work extractable from a state, to quantify genuine multipartite entanglement in strongly interacting systems, through controlled quenches or local measurements. Examples include the Tavis–Cummings, three-level Dicke, and transverse-field Ising models, and noisy parametrized circuits."
    },
    {
      "arxiv": "arXiv:2207.14354",
      "title": "Protecting information in a parametrically driven hybrid quantum system",
      "authors": "Siddharth Tiwary, Harsh Sharma, Himadri Shekhar Dhar",
      "journal": "Quantum 9, 1754 (2025)",
      "doi": "10.22331/q-2025-05-22-1754",
      "summary": "Inhomogeneity in a spin ensemble coupled to a cavity disrupts the storage and transfer of quantum information. Using a variational renormalization-group treatment, we show that a parametric drive strongly protects the encoded information against this decoherence."
    },
    {
      "arxiv": "arXiv:2302.07003",
      "title": "Improving performance of quantum heat engines using modified Otto cycle",
      "authors": "Revathy B. S., Harsh Sharma, Uma Divakaran",
      "journal": "J. Phys. A: Math. Theor. 57, 165302 (2024)",
      "doi": "10.1088/1751-8121/ad38ee",
      "summary": "Replacing one unitary stroke of a quantum Otto cycle with free evolution under a chosen Hamiltonian lets the working medium relax to a less excited state. This increases both work output and efficiency, most strongly when the engine operates across a critical point."
    }
  ],
  "talks": [
    { "year": "2025", "type": "Talk", "title": "Quantum Error Correction for Unresolvable Spin Ensembles", "event": "Quantum Trajectories", "venue": "ICTS–TIFR, Bengaluru", "eventUrl": "https://www.icts.res.in/program/qt", "eventLabel": "Programme", "videoUrl": "https://www.youtube.com/watch?v=PrN4ENJrXX4" },
    { "year": "2025", "type": "Talk", "title": "Quantum Error Correction for Unresolvable Spin Ensembles", "event": "APS Global Physics Summit", "venue": "Anaheim, California, USA", "eventUrl": "https://meetings-archive.aps.org/smt/2025/mar-t33/11/", "eventLabel": "Abstract", "videoUrl": "" },
    { "year": "2025", "type": "Poster", "title": "Protecting Information in a Parametrically Driven Hybrid Quantum System", "event": "Quantum Symposium for Young Investigators", "venue": "CQuICC, IIT Madras", "eventUrl": "https://sites.google.com/physics.iitm.ac.in/qsyi-2025/program", "eventLabel": "Programme", "videoUrl": "" },
    { "year": "2024", "type": "Talk", "title": "Quantum Error Correction for Unresolvable Spin Ensembles", "event": "CAP Congress", "venue": "Western University, Ontario, Canada", "eventUrl": "https://indico.global/event/440/contributions/10771/", "eventLabel": "Abstract", "videoUrl": "" },
    { "year": "2024", "type": "Workshop", "title": "", "event": "Quantum Information and Quantum Dynamics", "venue": "IIT Bombay", "eventUrl": "", "eventLabel": "", "videoUrl": "" },
    { "year": "2024", "type": "Conference", "title": "", "event": "Photonics, Quantum Information, and Quantum Communication", "venue": "S. N. Bose National Centre for Basic Sciences, Kolkata", "eventUrl": "https://www.bose.res.in/Conferences/PQIQC23/", "eventLabel": "", "videoUrl": "" },
    { "year": "2023", "type": "Workshop", "title": "", "event": "CREATE Commercialization & Communication", "venue": "Quantum Algorithms Institute, Canada", "eventUrl": "https://www.quantumalgorithmsinstitute.ca/", "eventLabel": "", "videoUrl": "" },
    { "year": "2023", "type": "Workshop", "title": "", "event": "ICONS 2023: Quantum Science and Technology", "venue": "QuICST, IIT Bombay", "eventUrl": "https://rnd.iitb.ac.in/sites/default/files/2024-10/Final_Report_QST%20Workshop%20%5BICONS%202023%5D_compressed.pdf", "eventLabel": "", "videoUrl": "" },
    { "year": "2021", "type": "Workshop", "title": "", "event": "Simulation Methods in Scientific Computing", "venue": "IIT Kharagpur", "eventUrl": "https://ccds.iitkgp.ac.in/nodal-center.php", "eventLabel": "", "videoUrl": "" },
    { "year": "2018", "type": "Camp", "title": "", "event": "NIUS Exposure-cum-Nurture Camp", "venue": "HBCSE, TIFR, Mumbai", "eventUrl": "https://nius.hbcse.tifr.res.in/", "eventLabel": "", "videoUrl": "" }
  ],
  "education": [
    { "period": "2022 – 2027", "degree": "PhD in Physics", "institution": "Indian Institute of Technology Bombay", "detail": "Expected completion: July 2027" },
    { "period": "2020 – 2022", "degree": "M.Sc. in Physics", "institution": "Indian Institute of Technology Palakkad", "detail": "Project: Enhancing the efficiency of quantum heat engines using kicked Ising systems" },
    { "period": "2017 – 2020", "degree": "B.Sc. (Hons.) in Physics", "institution": "Pt. Ravishankar Shukla University, Raipur", "detail": "" }
  ],
  "awards": [
    { "year": "2023", "title": "SFU–Mitacs Globalink Research Award", "organization": "Mitacs and Simon Fraser University", "detail": "Three-month collaboration on quantum error suppression in hybrid quantum systems" },
    { "year": "2022", "title": "Prime Minister’s Research Fellowship", "organization": "Ministry of Education, Government of India", "detail": "Direct entry, cycle 9" },
    { "year": "2022", "title": "Best M.Sc. Project in Physics", "organization": "IIT Palakkad", "detail": "" },
    { "year": "2022", "title": "Best M.Sc. Student in Physics", "organization": "IIT Palakkad", "detail": "Highest CGPA in the programme" }
  ],
  "qualifications": [
    { "year": "2022", "title": "CSIR–UGC NET (Lectureship)", "organization": "All India Rank 45" },
    { "year": "2021", "title": "Graduate Aptitude Test in Engineering (GATE)", "organization": "All India Rank 1544" },
    { "year": "2020", "title": "Joint Admission Test for M.Sc. (JAM)", "organization": "All India Rank 666" }
  ]
};
