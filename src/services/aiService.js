/**
 * PathForge AI - AI Service
 * Routes AI calls to Amazon Bedrock (via API Gateway + Lambda) in production,
 * or falls back to the local mock engine for local development.
 *
 * HOW IT WORKS:
 * - In production (Amplify): VITE_API_BASE_URL is set → real AWS calls
 * - In local dev: VITE_API_BASE_URL is empty → mock responses instantly
 *
 * AWS Architecture:
 *   Frontend → API Gateway → Lambda → Amazon Bedrock (Claude 3.5 Sonnet)
 *
 * API Endpoints (set via VITE_API_BASE_URL in .env):
 *   POST /api/v1/ai/coach           → Career coach chat
 *   POST /api/v1/ai/generate-roadmap → Personalised roadmap
 *   POST /api/v1/ai/generate-quiz   → Dynamic quiz questions
 */

import { CAREERS, SKILL_LEVELS } from '../data/careers';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Base URL for API Gateway. Set VITE_API_BASE_URL in .env or Amplify env variables.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Generic API call helper with graceful fallback logging.
 * If the API is not configured (no base URL) it throws so the local fallback runs.
 */
async function callAPI(path, body) {
  if (!API_BASE) {
    throw new Error('NO_API_URL'); // triggers local fallback
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

export const aiService = {
  /**
   * Generates a comprehensive skill gap analysis comparing learner's baseline
   * against industry expectations for their target role.
   *
   * AWS Target: POST /api/v1/ai/skill-gap → Lambda → Bedrock
   * Note: This is computed locally — it's deterministic math, not generative AI.
   */
  async generateSkillGapAnalysis(profile, userSkills = {}) {
    await delay(800);

    const career = CAREERS.find((c) => c.id === profile.careerGoal) || CAREERS[0];
    const skillsAnalysis = [];
    const strong = [];
    const developing = [];
    const majorGaps = [];

    career.skills.forEach((skill) => {
      const level = userSkills[skill.id] || 'none';
      let score = 15;
      if (level === 'advanced') score = 88;
      else if (level === 'intermediate') score = 65;
      else if (level === 'beginner') score = 38;

      let status = 'needs-attention';
      if (score >= 70) {
        status = 'strong';
        strong.push(skill.name);
      } else if (score >= 35) {
        status = 'developing';
        developing.push(skill.name);
      } else {
        majorGaps.push(skill.name);
      }

      skillsAnalysis.push({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        selfAssessment: level,
        mastery: score,
        status,
        description: skill.description,
      });
    });

    const averageMastery = Math.round(
      skillsAnalysis.reduce((acc, curr) => acc + curr.mastery, 0) / skillsAnalysis.length
    );

    return {
      targetCareer: career.title,
      readinessScore: averageMastery,
      strong,
      developing,
      majorGaps,
      skills: skillsAnalysis,
      summary: `You possess strong foundations in ${strong.slice(0, 2).join(' and ') || 'initial programming'}, but bridging to production ${career.title} requires mastering ${majorGaps.slice(0, 3).join(', ')}.`,
      generatedAt: new Date().toISOString(),
    };
  },

  /**
   * Generates a personalised week-by-week learning roadmap.
   *
   * AWS (production): POST /api/v1/ai/generate-roadmap → Lambda → Bedrock
   * Local (fallback):  Career-specific curriculum templates
   */
  async generateRoadmap(profile, skillGapAnalysis) {
    // --- Try real AWS Bedrock first ---
    try {
      const data = await callAPI('/api/v1/ai/generate-roadmap', { profile, skillGapAnalysis });
      console.log('[PathForge] Roadmap generated via Amazon Bedrock ✓');
      return data;
    } catch (err) {
      if (err.message !== 'NO_API_URL') {
        console.warn('[PathForge] Bedrock roadmap failed, using local fallback:', err.message);
      }
    }

    // --- Local fallback ---
    await delay(1400);

    const career = CAREERS.find((c) => c.id === profile.careerGoal) || CAREERS[0];
    const totalWeeks = profile.roadmapDuration || 8;
    const weeklyHours = profile.weeklyHours || 8;

    const templates = {
      'mlops-engineer': [
        { title: 'Python for Production', skills: ['Python'], objective: 'Master production Python: type hinting, Pydantic, async, and pytest test suites.' },
        { title: 'Git, Linux & Development Workflow', skills: ['Git/GitHub', 'Linux'], objective: 'Master Git trunk-based workflows, Bash scripting, and Linux system administration.' },
        { title: 'Docker Fundamentals', skills: ['Docker'], objective: 'Understand containerisation, multi-stage builds, non-root users, and minimal images.' },
        { title: 'AWS Cloud Foundations', skills: ['AWS Cloud'], objective: 'Provision secure AWS cloud resources, S3 storage, IAM policies, and ECR repositories.' },
        { title: 'CI/CD for Machine Learning', skills: ['CI/CD Pipelines', 'Git/GitHub'], objective: 'Automate build, test, and release pipelines with GitHub Actions and continuous training.' },
        { title: 'Kubernetes Fundamentals', skills: ['Kubernetes'], objective: 'Deploy and scale containerised machine learning services with Kubernetes and Helm.' },
        { title: 'Model Deployment & Monitoring', skills: ['Model Deployment', 'Monitoring & Drift'], objective: 'Serve low-latency models and configure Prometheus & Grafana for drift detection.' },
        { title: 'End-to-End MLOps Capstone', skills: ['MLOps Concepts', 'Model Deployment', 'CI/CD Pipelines'], objective: 'Deploy a complete production-grade MLOps system with automated retraining.' },
      ],
      'ai-ml-engineer': [
        { title: 'Advanced Python & Vector Computation', skills: ['Python for AI'], objective: 'Master NumPy vectorisation, Pandas optimisation, and high-performance data manipulation.' },
        { title: 'Mathematics & Gradient Optimisation', skills: ['Math & Linear Algebra'], objective: 'Understand matrix decompositions, backpropagation, and loss function landscapes.' },
        { title: 'Classical ML & Feature Engineering', skills: ['Scikit-Learn'], objective: 'Implement cross-validation, hyperparameter tuning, and ensemble techniques.' },
        { title: 'Deep Learning Architectures with PyTorch', skills: ['Deep Learning & PyTorch'], objective: 'Build, train, and debug custom neural networks, CNNs, and attention modules.' },
        { title: 'Transformer Foundations & Embeddings', skills: ['Deep Learning & PyTorch'], objective: 'Deep dive into self-attention, Hugging Face transformers, and vector representations.' },
        { title: 'RAG & Vector Database Architecture', skills: ['RAG & LLM Integration'], objective: 'Build Retrieval-Augmented Generation pipelines using Chroma/Pinecone and Amazon Bedrock.' },
        { title: 'LLM Fine-Tuning & Evaluation', skills: ['RAG & LLM Integration'], objective: 'Fine-tune models with LoRA/QLoRA and evaluate hallucination rates systematically.' },
        { title: 'Autonomous AI Agent Capstone', skills: ['RAG & LLM Integration', 'Python for AI'], objective: 'Ship a multi-tool autonomous AI agent system with persistent memory.' },
      ],
      'cloud-engineer': [
        { title: 'Cloud Networking & VPC Foundations', skills: ['Cloud Networking', 'AWS Architecture'], objective: 'Design secure VPC topologies, subnets, route tables, and NAT gateways.' },
        { title: 'Linux Systems & Server Automation', skills: ['Linux Systems'], objective: 'Automate server provisioning, system security hardening, and SSH key management.' },
        { title: 'Cloud Security & AWS IAM Deep Dive', skills: ['Cloud Security & IAM'], objective: 'Implement least-privilege IAM policies, KMS encryption, and AWS GuardDuty.' },
        { title: 'Docker Containers & Microservices', skills: ['Docker & Containers'], objective: 'Containerise enterprise applications and secure base images.' },
        { title: 'Infrastructure as Code with Terraform', skills: ['Terraform & IaC'], objective: 'Write modular declarative Terraform to provision AWS cloud architectures.' },
        { title: 'Kubernetes on AWS (Amazon EKS)', skills: ['Kubernetes (EKS)'], objective: 'Deploy and manage production workloads on managed Kubernetes clusters.' },
        { title: 'Cloud Observability & SRE', skills: ['Cloud Observability'], objective: 'Set up CloudWatch metric alarms, centralised logging, and synthetic canaries.' },
        { title: 'Enterprise Cloud Architecture Capstone', skills: ['AWS Architecture', 'Terraform & IaC'], objective: 'Deliver a multi-AZ, fault-tolerant, automated AWS infrastructure stack.' },
      ],
      'data-scientist': [
        { title: 'Advanced Data Wrangling with Python', skills: ['Python & Pandas'], objective: 'Master complex aggregations, time-series operations, and missing value imputation.' },
        { title: 'Statistical Inference & Hypothesis Testing', skills: ['Statistical Inference'], objective: 'Execute parametric/non-parametric tests, p-value correction, and Bayesian priors.' },
        { title: 'High-Performance SQL & Analytics', skills: ['Advanced SQL'], objective: 'Write window functions, recursive CTEs, and optimise analytical queries.' },
        { title: 'Interactive Visualisation & Storytelling', skills: ['Data Visualisation'], objective: 'Design executive-ready analytical dashboards with interactive charts and insights.' },
        { title: 'Supervised & Unsupervised ML Modelling', skills: ['Predictive Modelling'], objective: 'Build churn prediction, clustering, and decision tree ensembles with Scikit-Learn.' },
        { title: 'A/B Testing & Experimentation Design', skills: ['A/B Testing & Causal Inference'], objective: 'Design randomised controlled experiments, compute power, and guard against bias.' },
        { title: 'Feature Stores & Pipeline Orchestration', skills: ['Predictive Modelling', 'Python & Pandas'], objective: 'Create reproducible automated feature engineering pipelines.' },
        { title: 'End-to-End Business ML Capstone', skills: ['Predictive Modelling', 'Data Visualisation'], objective: 'Deliver a business forecasting model with executive recommendations.' },
      ],
      'devops-engineer': [
        { title: 'Linux Administration & Shell Mastery', skills: ['Linux & Scripting'], objective: 'Master Linux kernel tuning, systemd, and POSIX shell automation scripts.' },
        { title: 'Modern Git & Collaborative Workflows', skills: ['Git & Version Control'], objective: 'Implement trunk-based development, commit signing, and branch policies.' },
        { title: 'Docker & Container Security', skills: ['Docker Containerisation'], objective: 'Build hardened, minimal container images with Trivy vulnerability scanning.' },
        { title: 'CI/CD Pipelines with GitHub Actions', skills: ['CI/CD Automation'], objective: 'Architect multi-stage build, test, and release matrix workflows.' },
        { title: 'Infrastructure as Code with Terraform', skills: ['Terraform (IaC)'], objective: 'Manage cloud infrastructure declaratively with remote state locking.' },
        { title: 'Kubernetes Cluster Administration', skills: ['Kubernetes & Helm'], objective: 'Deploy workloads, configure ingress controllers, and manage Helm charts.' },
        { title: 'Observability, Logging & SRE', skills: ['Observability & SRE'], objective: 'Configure Prometheus, Grafana alerts, and log aggregation pipelines.' },
        { title: 'GitOps & Zero-Downtime Deployment Capstone', skills: ['CI/CD Automation', 'Kubernetes & Helm'], objective: 'Build a full GitOps delivery pipeline with automated rollbacks.' },
      ],
    };

    const curriculum = templates[career.id] || templates['mlops-engineer'];
    const missions = curriculum.slice(0, totalWeeks).map((item, idx) => {
      const weekNum = idx + 1;
      return {
        id: `mission-${weekNum}`,
        week: weekNum,
        title: item.title,
        status: weekNum === 1 ? 'current' : 'locked',
        estimatedHours: weeklyHours,
        progress: 0,
        skills: item.skills,
        objective: item.objective,
        difficulty: weekNum <= 2 ? 'Beginner' : weekNum <= 5 ? 'Intermediate' : 'Advanced',
        remainingTime: `${weeklyHours}h remaining`,
        tasks: [
          { id: `t${weekNum}-1`, title: `Core principles & theoretical foundation of ${item.skills[0]}`, completed: false },
          { id: `t${weekNum}-2`, title: `Syntax patterns, command-line usage & best practices`, completed: false },
          { id: `t${weekNum}-3`, title: `Hands-on configuration and environment setup`, completed: false },
          { id: `t${weekNum}-4`, title: `Build realistic code implementation & handle edge cases`, completed: false },
          { id: `t${weekNum}-5`, title: `Unit testing, debugging, and verification checks`, completed: false },
        ],
        resources: [
          { title: `${item.title} Official Documentation`, url: '#', type: 'Documentation' },
          { title: `${item.skills[0]} Best Practices Guide`, url: '#', type: 'Architecture Reference' },
          { title: 'Interactive Code Walkthrough & Exercises', url: '#', type: 'Hands-on Lab' },
        ],
        challenge: {
          title: `Practical Challenge: Implement ${item.title}`,
          description: `Create a tested, production-grade project demonstrating ${item.skills.join(' and ')} following industry standards.`,
          requirements: ['Clean modular project structure', 'Full documentation and runnable example', 'Automated verification or test suite'],
          completed: false,
        },
        assessmentId: `assessment-${weekNum}`,
      };
    });

    return {
      careerGoal: career.id,
      careerTitle: career.title,
      duration: totalWeeks,
      weeklyHours,
      progress: 0,
      missions,
      generatedAt: new Date().toISOString(),
    };
  },

  /**
   * Generates a 5-question multiple choice assessment for a given topic.
   *
   * AWS (production): POST /api/v1/ai/generate-quiz → Lambda → Bedrock
   * Local (fallback):  Pre-built question banks + generic fallback
   */
  async generateQuiz(topic, difficulty = 'Intermediate', careerGoal) {
    // --- Try real AWS Bedrock first ---
    try {
      const data = await callAPI('/api/v1/ai/generate-quiz', { topic, difficulty, careerGoal });
      console.log('[PathForge] Quiz generated via Amazon Bedrock ✓');
      return data;
    } catch (err) {
      if (err.message !== 'NO_API_URL') {
        console.warn('[PathForge] Bedrock quiz failed, using local fallback:', err.message);
      }
    }

    // --- Local fallback ---
    await delay(1000);

    const questionBanks = {
      Docker: [
        {
          id: 'q1',
          question: 'What is the primary difference between a Docker container and a traditional Virtual Machine (VM)?',
          options: [
            'Containers share the host OS kernel and isolate processes in user space, whereas VMs include an entire guest OS running on a hypervisor.',
            'Containers require hypervisor hardware virtualisation while VMs run directly on bare metal.',
            'Containers only run compiled binary applications whereas VMs can run interpreted languages.',
            'VMs execute significantly faster because they bypass kernel network bridges.',
          ],
          correctIndex: 0,
          explanation: 'Containers achieve lightweight virtualisation by sharing the host OS kernel and utilising cgroups and namespaces, unlike VMs which run full guest OS instances.',
          concept: 'Container Architecture',
        },
        {
          id: 'q2',
          question: 'Why are multi-stage Docker builds recommended for Python & ML production images?',
          options: [
            'They enable running multiple Python interpreters concurrently inside a single container.',
            'They separate build tools/compilers from runtime, dramatically reducing image size and attack surface.',
            'They automatically allocate GPU memory to the container at build time.',
            'They bypass the Docker layer cache to ensure clean builds.',
          ],
          correctIndex: 1,
          explanation: 'Multi-stage builds allow you to use heavy build environments in intermediate stages, copying only necessary artifacts to the final minimal runtime image.',
          concept: 'Docker Images & Optimisation',
        },
        {
          id: 'q3',
          question: 'Which Dockerfile instruction specifies the default command executed when a container runs, while allowing user arguments to be appended easily?',
          options: [
            'RUN ["python", "app.py"]',
            'ENTRYPOINT ["python", "main.py"] combined with CMD',
            'EXPOSE 8000',
            'ENV EXECUTE="python"',
          ],
          correctIndex: 1,
          explanation: 'ENTRYPOINT sets the executable command, and CMD provides default arguments that can be overridden at runtime.',
          concept: 'Dockerfile Directives',
        },
        {
          id: 'q4',
          question: 'What happens to files written inside a container without volumes or bind mounts when the container is removed?',
          options: [
            'Files are saved into the parent Docker image layer permanently.',
            'Files are backed up to the Docker daemon local cache.',
            'Files written to the container writable layer are permanently lost.',
            'Files automatically sync to the host /tmp directory.',
          ],
          correctIndex: 2,
          explanation: 'Container writable layers are ephemeral; once a container is deleted, any unpersisted filesystem state is permanently destroyed.',
          concept: 'Persistent Storage & Volumes',
        },
        {
          id: 'q5',
          question: 'For running containerised applications securely in production, which practice is essential?',
          options: [
            'Always execute containers as the default root user for full socket access.',
            'Define a dedicated non-root user with minimal permissions inside the Dockerfile using the USER directive.',
            'Disable container healthchecks to reduce background CPU cycles.',
            'Embed cloud secret keys into Docker ENV statements.',
          ],
          correctIndex: 1,
          explanation: 'Running as root in a container poses significant security risks. Creating and switching to a non-root USER minimises privilege escalation vulnerabilities.',
          concept: 'Container Security',
        },
      ],
      'Python for Production': [
        {
          id: 'q1',
          question: 'In Python typing, what is the purpose of generic types (e.g. `list[T]` or `TypeVar`)?',
          options: [
            'To disable runtime type checking for faster execution speed.',
            'To write flexible, reusable functions and classes that preserve strict type safety across different types.',
            'To force automatic type casting of inputs at runtime.',
            'To convert Python scripts into C++ binaries.',
          ],
          correctIndex: 1,
          explanation: 'Generics allow developers to parameterise classes and functions over types without losing static type checking guarantees.',
          concept: 'Type Hinting & Generics',
        },
        {
          id: 'q2',
          question: 'How does Pydantic V2 achieve significant speedups compared to V1 when validating data models?',
          options: [
            'By delegating core validation logic to a compiled Rust core (pydantic-core).',
            'By completely removing runtime type validation.',
            'By validating only strings and ignoring nested objects.',
            'By compiling Python code using PyPy JIT.',
          ],
          correctIndex: 0,
          explanation: 'Pydantic V2 was rewritten with a high-performance Rust core (pydantic-core), resulting in 5x-50x faster serialisation and validation.',
          concept: 'Pydantic Validation',
        },
        {
          id: 'q3',
          question: 'In `asyncio`, what is the correct way to run multiple async coroutines concurrently and gather their results?',
          options: [
            '`asyncio.wait_forever(tasks)`',
            '`await asyncio.gather(*tasks)`',
            '`multiprocessing.spawn(tasks)`',
            '`thread.join_all(tasks)`',
          ],
          correctIndex: 1,
          explanation: '`asyncio.gather(*tasks)` schedules multiple awaitables concurrently onto the event loop and returns an ordered list of results.',
          concept: 'Async Concurrency',
        },
        {
          id: 'q4',
          question: 'What is the role of `pytest` fixtures with `autouse=False`?',
          options: [
            'They run unconditionally before every test in the entire test suite.',
            'They provide modular, reusable test dependencies and setup/teardown logic only when injected as test arguments.',
            'They generate random data using generative adversarial algorithms.',
            'They prevent failing tests from reporting errors.',
          ],
          correctIndex: 1,
          explanation: 'Pytest fixtures provide structured dependency injection for test setup and teardown, invoked only by tests that explicitly declare them.',
          concept: 'Unit Testing with Pytest',
        },
        {
          id: 'q5',
          question: 'Which configuration file is the modern standard for Python project packaging and dependency management defined in PEP 518/621?',
          options: ['setup.py', 'requirements.txt', 'pyproject.toml', 'Pipfile.lock'],
          correctIndex: 2,
          explanation: '`pyproject.toml` is the PEP standard for specifying build systems, dependencies, and project metadata.',
          concept: 'Python Packaging',
        },
      ],
    };

    const questions = questionBanks[topic] || [
      { id: 'q1', question: `What is the core architectural principle behind mastering ${topic}?`, options: ['Separation of concerns and declarative system configuration.', 'Monolithic deployment with manual server configuration.', 'Unchecked runtime execution without automated telemetry.', 'Hardcoding secrets into the codebase.'], correctIndex: 0, explanation: `${topic} demands declarative, modular engineering and automated testability.`, concept: `${topic} Architecture` },
      { id: 'q2', question: `When deploying ${topic} in production, which metric is most critical?`, options: ['Total lines of commented code.', 'P95/P99 latency, error rates, and resource utilisation.', 'Number of developer commits per hour.', 'Local laptop battery usage.'], correctIndex: 1, explanation: 'Production systems must monitor tail latency, failure rates, and infrastructure headroom.', concept: 'Production Observability' },
      { id: 'q3', question: `How does continuous verification improve reliability in ${topic}?`, options: ['It eliminates the need for unit testing.', 'It catches regressions early in the lifecycle before reaching production.', 'It slows down delivery to ensure zero code changes.', 'It bypasses code review.'], correctIndex: 1, explanation: 'Automated continuous verification guarantees software stability across iterations.', concept: 'Quality & Reliability' },
      { id: 'q4', question: `What security practice is most critical when designing systems for ${topic}?`, options: ['Principle of least privilege and encrypted data at rest/in transit.', 'Granting full root / admin rights to every service.', 'Disabling TLS certificate checks.', 'Using plain HTTP for all endpoints.'], correctIndex: 0, explanation: 'Least privilege access and cryptographic encryption form standard zero-trust security postures.', concept: 'Security Hardening' },
      { id: 'q5', question: `How should reproducible environments be managed for ${topic}?`, options: ['Manual document checklists updated manually each quarter.', 'Immutable infrastructure as code and declarative container artifacts.', 'Directly editing files on production servers via SSH.', 'Copying zip files across servers.'], correctIndex: 1, explanation: 'Immutable infrastructure as code ensures zero environment drift between staging and prod.', concept: 'Reproducibility & IaC' },
    ];

    return { topic, difficulty, totalQuestions: questions.length, questions, timeLimitMinutes: 10 };
  },

  /**
   * Evaluates assessment performance and generates an adaptive roadmap modification.
   * Score < 60%: Insert targeted reinforcement mission.
   * (Computed locally — deterministic logic, not generative AI.)
   */
  async adaptRoadmap(currentMissions, assessmentResult, currentMission) {
    await delay(800);

    const score = assessmentResult.score;
    const missionTitle = currentMission?.title || 'Current Topic';
    const topic = currentMission?.skills?.[0] || 'Core Subject';

    let adaptation = {
      isAdapted: false, reason: null, message: null, score,
      newMissions: [...currentMissions], addedMission: null, recommendation: null,
    };

    if (score < 60) {
      adaptation.isAdapted = true;
      adaptation.reason = 'Skill Gap Detected';
      adaptation.message = `Your ${missionTitle} assessment (${score}%) revealed that core concepts need hands-on reinforcement before advancing. PathForge AI has inserted a personalised remediation challenge.`;

      const reinforcementId = `reinforce-${Date.now()}`;
      const reinforcementMission = {
        id: reinforcementId, week: currentMission.week,
        title: `${topic} Reinforcement & Remediation Challenge`,
        status: 'current', estimatedHours: 6, progress: 0,
        skills: currentMission.skills,
        objective: `Close conceptual and practical gaps in ${topic} identified during your recent assessment.`,
        difficulty: 'Reinforcement', remainingTime: '6h remaining',
        isAdapted: true, adaptationReason: `Inserted after scoring ${score}% on ${missionTitle}`,
        tasks: [
          { id: `${reinforcementId}-1`, title: `Review detailed assessment feedback and misconceptions in ${topic}`, completed: false },
          { id: `${reinforcementId}-2`, title: `Hands-on remediation exercise: Debug broken ${topic} configuration`, completed: false },
          { id: `${reinforcementId}-3`, title: `Implement guided micro-project focusing on weak assessment areas`, completed: false },
          { id: `${reinforcementId}-4`, title: `Complete targeted self-check verification lab`, completed: false },
        ],
        resources: [
          { title: `${topic} Interactive Remediation Guide`, url: '#', type: 'Remediation Guide' },
          { title: `${topic} Common Anti-Patterns & Fixes`, url: '#', type: 'Deep Dive' },
          { title: 'Interactive Debugging Playground', url: '#', type: 'Hands-on Lab' },
        ],
        challenge: {
          title: `${topic} Mastery Drill`,
          description: `Resolve 3 deliberate failure scenarios in a sample ${topic} project and document root causes.`,
          requirements: ['Identify failure modes', 'Correct all bugs', 'Verify with passing automated tests'],
          completed: false,
        },
        assessmentId: `assessment-${reinforcementId}`,
      };

      const currentIndex = currentMissions.findIndex((m) => m.id === currentMission.id);
      const updatedList = [...currentMissions];
      if (currentIndex >= 0) {
        updatedList[currentIndex] = { ...updatedList[currentIndex], status: 'completed', progress: 100 };
        updatedList.splice(currentIndex + 1, 0, reinforcementMission);
        updatedList.forEach((m, idx) => { m.week = idx + 1; });
      }
      adaptation.newMissions = updatedList;
      adaptation.addedMission = reinforcementMission;
      adaptation.recommendation = `Complete the 4 targeted remediation tasks before proceeding.`;
    } else if (score < 80) {
      adaptation.reason = 'Good Progress with Recommended Review';
      adaptation.message = `Solid score of ${score}%. You are ready to advance, but we recommend reviewing weak areas during your study hours.`;
      adaptation.recommendation = `Spend 1 hour reviewing ${assessmentResult.weaknesses?.[0] || 'the trickier assessment concepts'}.`;
      const currentIndex = currentMissions.findIndex((m) => m.id === currentMission.id);
      if (currentIndex >= 0) {
        adaptation.newMissions[currentIndex] = { ...adaptation.newMissions[currentIndex], status: 'completed', progress: 100 };
        if (currentIndex + 1 < adaptation.newMissions.length) {
          adaptation.newMissions[currentIndex + 1] = { ...adaptation.newMissions[currentIndex + 1], status: 'current' };
        }
      }
    } else {
      adaptation.reason = 'Mastery Demonstrated';
      adaptation.message = `Outstanding performance (${score}%)! Advancing to the next curriculum milestone.`;
      adaptation.recommendation = `Keep up this momentum! You are tracking ahead of schedule.`;
      const currentIndex = currentMissions.findIndex((m) => m.id === currentMission.id);
      if (currentIndex >= 0) {
        adaptation.newMissions[currentIndex] = { ...adaptation.newMissions[currentIndex], status: 'completed', progress: 100 };
        if (currentIndex + 1 < adaptation.newMissions.length) {
          adaptation.newMissions[currentIndex + 1] = { ...adaptation.newMissions[currentIndex + 1], status: 'current' };
        }
      }
    }
    return adaptation;
  },

  /**
   * Generates intelligent career coaching responses.
   *
   * AWS (production): POST /api/v1/ai/coach → Lambda → Bedrock (Claude 3.5 Sonnet)
   * Local (fallback):  Keyword-matched contextual responses
   */
  async generateCoachResponse(context, userMessage) {
    // --- Try real AWS Bedrock first ---
    try {
      const data = await callAPI('/api/v1/ai/coach', { message: userMessage, context });
      console.log('[PathForge] Coach response via Amazon Bedrock ✓');
      return data.reply;
    } catch (err) {
      if (err.message !== 'NO_API_URL') {
        console.warn('[PathForge] Bedrock coach failed, using local fallback:', err.message);
      }
    }

    // --- Local fallback ---
    await delay(1000);

    const lower = userMessage.toLowerCase();
    const career = context?.careerGoal || 'MLOps Engineer';
    const currentMission = context?.currentMission?.title || 'Docker Fundamentals';
    const currentStreak = context?.stats?.currentStreak || 4;

    if (lower.includes('focus') || lower.includes('this week') || lower.includes('what should i do')) {
      return `Right now, your primary focus should be on **${currentMission}**.\n\nHere is your recommended action plan for this week:\n1. **Complete your container isolation tasks** — Pay special attention to multi-stage builds and non-root execution.\n2. **Build the practical API packaging challenge** — Create a minimal Dockerfile for a FastAPI prediction endpoint.\n3. **Target 80%+ on your upcoming assessment** — This unlocks the next week without triggering a remediation cycle!\n\nYou currently have a **${currentStreak}-day learning streak** — keep up the daily rhythm!`;
    }

    if (lower.includes('kubernetes') || lower.includes('k8s')) {
      return `**Why Kubernetes is crucial for ${career}:**\n\n- **Zero-Downtime Rolling Updates**: Deploy new model weights without dropping active inference requests.\n- **Horizontal Pod Autoscaling (HPA)**: Scale inference pods automatically when traffic spikes.\n- **GPU Resource Slicing**: Efficiently share expensive cloud GPU hardware across multiple model services.\n- **Self-Healing Infrastructure**: Automatically restart failed inference pods.\n\nYou will master Kubernetes in an upcoming week, building directly on the container knowledge you are acquiring right now!`;
    }

    if (lower.includes('project') || lower.includes('portfolio')) {
      return `Great question! The most compelling portfolio project for an aspiring **${career}** is an **Automated Model Serving & Drift Pipeline**:\n\n1. **Data & Model**: Train a lightweight classifier using Scikit-Learn or PyTorch.\n2. **Packaging**: Containerise the FastAPI inference server with multi-stage Docker builds.\n3. **CI/CD**: Set up GitHub Actions to build the Docker container and push to Amazon ECR.\n4. **Monitoring**: Add Prometheus metrics tracking inference latency and data drift.\n\nThis project directly proves to hiring managers that you understand software engineering, cloud infrastructure, and ML lifecycle management!`;
    }

    if (lower.includes('aws') || lower.includes('cloud') || lower.includes('cert')) {
      return `For **${career}**, the most impactful AWS services to focus on are:\n\n1. **Amazon ECR & ECS / EKS**: Container registries and orchestration.\n2. **Amazon S3 & IAM**: Storage for model weights with granular least-privilege security.\n3. **Amazon Bedrock & SageMaker**: Managed AI foundation models and training pipelines.\n\n**Recommended certification**: AWS Certified Solutions Architect – Associate (SAA-C03) or AWS Certified Machine Learning – Specialty (MLS-C01).`;
    }

    return `As your **PathForge AI Career Coach**, I'm analysing your journey toward becoming a world-class **${career}**.\n\nYou're making steady headway with **${context?.stats?.overallProgress || 38}% overall completion** across your roadmap.\n\nHow can I help you accelerate today? We can discuss:\n- Breaking down complex topics in **${currentMission}**\n- Architecture advice for your portfolio projects\n- Interview preparation strategies\n- How upcoming roadmap milestones connect to real industry roles`;
  },
};
