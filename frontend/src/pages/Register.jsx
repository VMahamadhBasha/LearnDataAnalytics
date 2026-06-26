import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, User as UserIcon, Mail, AlertCircle, Sparkles, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

// ─── Validation Rules ────────────────────────────────────────────────────────

const RULES = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    patternMsg: 'Only letters, spaces, hyphens, and apostrophes allowed',
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    patternMsg: 'Only letters, spaces, hyphens, and apostrophes allowed',
  },
  email: {
    required: true,
    maxLength: 100,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    patternMsg: 'Enter a valid email address',
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_.-]+$/,
    patternMsg: 'Only letters, numbers, underscores, dots, and hyphens allowed',
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
  },
};

// Password strength checker — returns { score: 0-4, label, color }
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '#374151' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Too weak', color: '#ef4444' },
    { label: 'Weak', color: '#f97316' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Strong', color: '#22c55e' },
    { label: 'Very strong', color: '#16a34a' },
  ];
  return { score, ...levels[score] };
}

// Validate a single field — returns error string or ''
function validateField(name, value, allValues = {}) {
  const rule = RULES[name];
  if (!rule) return '';

  const val = typeof value === 'string' ? value.trim() : value;

  if (rule.required && !val) return 'This field is required';
  if (!val) return ''; // not required and empty → fine

  if (rule.minLength && val.length < rule.minLength)
    return `Minimum ${rule.minLength} characters required`;
  if (rule.maxLength && val.length > rule.maxLength)
    return `Maximum ${rule.maxLength} characters allowed`;
  if (rule.pattern && !rule.pattern.test(val))
    return rule.patternMsg;

  // Password-specific rules
  if (name === 'password') {
    if (!/[A-Za-z]/.test(val)) return 'Password must contain at least one letter';
    if (!/[0-9]/.test(val)) return 'Password must contain at least one number';
  }

  return '';
}

// Validate all fields — returns { fieldName: errorMsg } map
function validateAll(values) {
  const errors = {};
  Object.keys(RULES).forEach((field) => {
    const msg = validateField(field, values[field], values);
    if (msg) errors[field] = msg;
  });
  return errors;
}

// ─── Password Requirements List ───────────────────────────────────────────────

function PasswordRequirements({ password }) {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains an uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains a number', met: /[0-9]/.test(password) },
    { label: 'Contains a special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {checks.map((c) => (
        <li key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: c.met ? '#22c55e' : 'var(--text-muted)' }}>
          {c.met
            ? <CheckCircle2 size={13} style={{ flexShrink: 0 }} />
            : <XCircle size={13} style={{ flexShrink: 0 }} />}
          {c.label}
        </li>
      ))}
    </ul>
  );
}

// ─── Reusable Field Components ────────────────────────────────────────────────

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', margin: '0.3rem 0 0', fontSize: '0.75rem', color: 'var(--danger)' }}>
      <AlertCircle size={12} style={{ flexShrink: 0 }} />
      {msg}
    </p>
  );
}

function PasswordStrengthBar({ password }) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '0.25rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              backgroundColor: i <= score ? color : '#1f2937',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: '0.7rem', color, margin: 0, textAlign: 'right' }}>{label}</p>
    </div>
  );
}

// ─── Main Register Component ──────────────────────────────────────────────────

const Register = () => {
  const { register } = useAuth();

  // Form field states (individual — no object state)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState({});

  // Which fields have been "touched" (blurred at least once)
  const [touched, setTouched] = useState({});

  // UI states
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  // Current form values object (for bulk validation)
  function getValues() {
    return { firstName, lastName, email, username, password };
  }

  // Mark field as touched and validate it immediately
  function handleBlur(name, value) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const msg = validateField(name, value, getValues());
    setFieldErrors((prev) => ({ ...prev, [name]: msg }));
  }

  // Live validate on change only if field was already touched
  function handleChange(name, value, setter) {
    setter(value);
    if (touched[name]) {
      const msg = validateField(name, value, getValues());
      setFieldErrors((prev) => ({ ...prev, [name]: msg }));
    }
    // Clear server error on any change
    if (serverError) setServerError('');
  }

  // Check if a field looks valid (for green border)
  function isFieldValid(name, value) {
    return touched[name] && !validateField(name, value, getValues());
  }

  function getBorderColor(name, value) {
    if (!touched[name]) return 'var(--border-color)';
    return validateField(name, value, getValues())
      ? 'rgba(239, 68, 68, 0.6)'
      : 'rgba(34, 197, 94, 0.5)';
  }

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    // Touch all fields to show all errors
    setTouched({ firstName: true, lastName: true, email: true, username: true, password: true });

    const errors = validateAll(getValues());
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return; // stop if any error

    setLoading(true);
    try {
      await register(
        username.trim(),
        email.trim(),
        password.trim(),
        firstName.trim(),
        lastName.trim()
      );
      window.location.href = '/login?registered=true';
    } catch (err) {
      // Handle specific HTTP errors from backend
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 409) {
        // Conflict — username or email already taken
        const lower = (msg || '').toLowerCase();
        if (lower.includes('email')) {
          setFieldErrors((prev) => ({ ...prev, email: 'This email is already registered' }));
          setTouched((prev) => ({ ...prev, email: true }));
        } else {
          setFieldErrors((prev) => ({ ...prev, username: 'This username is already taken' }));
          setTouched((prev) => ({ ...prev, username: true }));
        }
      } else if (status === 400) {
        setServerError(msg || 'Invalid data submitted. Please check your inputs.');
      } else {
        setServerError(msg || 'Registration failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Field input style helper
  function inputStyle(name, value, extraLeft) {
    return {
      paddingLeft: extraLeft || '0.75rem',
      borderColor: getBorderColor(name, value),
      transition: 'border-color 0.2s',
    };
  }

  const hasAnyError = Object.values(fieldErrors).some(Boolean);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0b0f19',
      background: 'radial-gradient(circle at center, #1b253e 0%, #0b0f19 70%)',
      padding: '1.5rem',
    }}>
      <div className="card animate-slide-up" style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: 'rgba(19, 26, 46, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            padding: '0.5rem',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            marginBottom: '0.75rem',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Create Student Account
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Unlock 100% free courses and start earning certificates
          </p>
        </div>

        {/* Server / global error banner */}
        {serverError && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--danger)',
            fontSize: '0.8rem',
            marginBottom: '1.25rem',
            lineHeight: 1.4,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* First Name + Last Name */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="firstName">
                First Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="firstName"
                type="text"
                className="form-control"
                placeholder="John"
                value={firstName}
                maxLength={50}
                onChange={(e) => handleChange('firstName', e.target.value, setFirstName)}
                onBlur={(e) => handleBlur('firstName', e.target.value)}
                style={inputStyle('firstName', firstName)}
                disabled={loading}
                autoComplete="given-name"
              />
              <FieldError msg={touched.firstName && fieldErrors.firstName} />
            </div>

            <div style={{ flex: 1 }}>
              <label className="form-label" htmlFor="lastName">
                Last Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="lastName"
                type="text"
                className="form-control"
                placeholder="Doe"
                value={lastName}
                maxLength={50}
                onChange={(e) => handleChange('lastName', e.target.value, setLastName)}
                onBlur={(e) => handleBlur('lastName', e.target.value)}
                style={inputStyle('lastName', lastName)}
                disabled={loading}
                autoComplete="family-name"
              />
              <FieldError msg={touched.lastName && fieldErrors.lastName} />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <Mail size={16} />
              </span>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="john.doe@example.com"
                value={email}
                maxLength={100}
                onChange={(e) => handleChange('email', e.target.value, setEmail)}
                onBlur={(e) => handleBlur('email', e.target.value)}
                style={inputStyle('email', email, '2.5rem')}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            <FieldError msg={touched.email && fieldErrors.email} />
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <UserIcon size={16} />
              </span>
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="johndoe"
                value={username}
                maxLength={50}
                onChange={(e) => handleChange('username', e.target.value.toLowerCase(), setUsername)}
                onBlur={(e) => handleBlur('username', e.target.value)}
                style={inputStyle('username', username, '2.5rem')}
                disabled={loading}
                autoComplete="username"
                spellCheck={false}
              />
            </div>
            <FieldError msg={touched.username && fieldErrors.username} />
            {!fieldErrors.username && touched.username && username.trim() && (
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                Letters, numbers, underscores, dots, hyphens only
              </p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <KeyRound size={16} />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Min. 8 characters"
                value={password}
                maxLength={128}
                onChange={(e) => handleChange('password', e.target.value, setPassword)}
                onBlur={(e) => { handleBlur('password', e.target.value); setShowRequirements(false); }}
                onFocus={() => setShowRequirements(true)}
                style={inputStyle('password', password, '2.5rem')}
                disabled={loading}
                autoComplete="new-password"
              />
              {/* Show / hide toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength bar */}
            {password && <PasswordStrengthBar password={password} />}

            {/* Requirements checklist — shown while field is focused */}
            {showRequirements && <PasswordRequirements password={password} />}

            <FieldError msg={touched.password && fieldErrors.password} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              marginTop: '0.75rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '14px', height: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  display: 'inline-block',
                }} />
                Creating Account...
              </span>
            ) : 'Create Account'}
          </button>

          {/* Field error summary — only shown on submit attempt */}
          {hasAnyError && Object.keys(touched).length === 5 && (
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.5rem' }}>
              Please fix the errors above before continuing.
            </p>
          )}
        </form>

        {/* Login link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'underline' }}>
            Sign In
          </a>
        </div>
      </div>

      {/* Spinner keyframe — injected inline so no CSS file dependency */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Register;