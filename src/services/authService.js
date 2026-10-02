/**
 * PathForge AI - Authentication Service
 * Manages user authentication, session state, and demo credentials.
 * 
 * FUTURE AWS ARCHITECTURE NOTE:
 * In production on AWS, this local simulation will be replaced by Amazon Cognito:
 * - Registration will invoke Cognito SignUp / AdminCreateUser with JWT issuance.
 * - Login will authenticate against Cognito User Pools and store access/refresh tokens.
 * - Current user session will be verified via AWS Amplify Auth or Cognito SDK.
 */

import { storageService } from './storageService';

const USERS_REGISTRY_KEY = 'pathforge_registered_users';

const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (users) => {
  try {
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving user registry:', err);
  }
};

export const authService = {
  /**
   * Log in with email and password
   */
  async login(email, password) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if demo user
    if (trimmedEmail === 'demo@pathforge.ai' || trimmedEmail === 'alex.rivera@pathforge.ai') {
      return this.loginDemo();
    }

    // Check registered users
    const registered = getRegisteredUsers();
    const user = registered.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      // If user doesn't exist yet in registry, let's check current user in storage
      const active = storageService.getUser();
      if (active && active.email.toLowerCase() === trimmedEmail) {
        return active;
      }
      throw new Error('User not found. Please register or click "Explore Demo".');
    }

    if (user.password !== password) {
      throw new Error('Invalid credentials. Please verify your password.');
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      careerGoal: user.careerGoal || null,
      onboardingComplete: Boolean(user.onboardingComplete),
      weeklyHours: user.weeklyHours || 8,
      learningStyle: user.learningStyle || 'balanced',
      roadmapDuration: user.roadmapDuration || 8,
      stats: user.stats || {
        overallProgress: 0,
        missionsCompleted: 0,
        totalMissions: 8,
        averageQuizScore: 0,
        learningHours: 0,
        currentStreak: 1,
      },
    };

    storageService.saveUser(sessionUser);
    return sessionUser;
  },

  /**
   * Register a new user account
   */
  async register({ name, email, password }) {
    await new Promise((resolve) => setTimeout(resolve, 750));

    if (!name?.trim()) throw new Error('Please enter your full name.');
    if (!email?.trim() || !email.includes('@')) throw new Error('Please provide a valid email address.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

    const trimmedEmail = email.trim().toLowerCase();
    const registered = getRegisteredUsers();

    if (registered.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password, // In real AWS, password handled securely by Amazon Cognito
      careerGoal: null,
      onboardingComplete: false,
      createdAt: new Date().toISOString(),
      weeklyHours: 8,
      learningStyle: 'balanced',
      roadmapDuration: 8,
      stats: {
        overallProgress: 0,
        missionsCompleted: 0,
        totalMissions: 8,
        averageQuizScore: 0,
        learningHours: 0,
        currentStreak: 1,
      },
    };

    registered.push(newUser);
    saveRegisteredUsers(registered);

    // Save active session
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    storageService.saveUser(sessionUser);

    return sessionUser;
  },

  /**
   * Fast load pre-populated demo learner (Alex Rivera)
   */
  async loginDemo() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const demoUser = storageService.loadDemoState();
    return demoUser;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return storageService.getUser();
  },

  /**
   * Update current user profile
   */
  async updateUser(updates) {
    const current = storageService.getUser();
    if (!current) throw new Error('No active user session');
    const updated = { ...current, ...updates };
    storageService.saveUser(updated);

    // Also update in registered registry
    const registered = getRegisteredUsers();
    const idx = registered.findIndex((u) => u.id === current.id);
    if (idx >= 0) {
      registered[idx] = { ...registered[idx], ...updates };
      saveRegisteredUsers(registered);
    }

    return updated;
  },

  /**
   * Log out and clear active session
   */
  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    storageService.removeUser();
    return true;
  },
};
