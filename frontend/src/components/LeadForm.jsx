import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leadsAPI } from '../services/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select } from './ui/Select';
import { ArrowLeft } from 'lucide-react';

const SOURCES = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];
const STATUSES = ['new', 'contacted', 'qualified', 'lost', 'won'];

const LeadForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    source: 'website',
    status: 'new',
    score: 0,
    leadValue: '',
    lastActivityAt: '',
    isQualified: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && id) {
      fetchLead();
    }
  }, [isEdit, id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadsAPI.getLead(id);
      const lead = response.data;
      
      setFormData({
        firstName: lead.firstName || '',
        lastName: lead.lastName || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        city: lead.city || '',
        state: lead.state || '',
        source: lead.source || 'website',
        status: lead.status || 'new',
        score: lead.score || 0,
        leadValue: lead.leadValue || '',
        lastActivityAt: lead.lastActivityAt ? new Date(lead.lastActivityAt).toISOString().split('T')[0] : '',
        isQualified: lead.isQualified || false,
      });
    } catch (error) {
      console.error('Error fetching lead:', error);
      alert('Failed to load lead data');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.source) {
      newErrors.source = 'Source is required';
    }

    if (formData.score < 0 || formData.score > 100) {
      newErrors.score = 'Score must be between 0 and 100';
    }

    if (formData.leadValue && formData.leadValue < 0) {
      newErrors.leadValue = 'Lead value cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        score: Number(formData.score),
        leadValue: formData.leadValue ? Number(formData.leadValue) : undefined,
        lastActivityAt: formData.lastActivityAt || undefined,
      };

      if (isEdit) {
        await leadsAPI.updateLead(id, submitData);
        alert('Lead updated successfully!');
      } else {
        await leadsAPI.createLead(submitData);
        alert('Lead created successfully!');
      }

      navigate('/');
    } catch (error) {
      console.error('Error saving lead:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save lead';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isEdit && loading && !formData.firstName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Lead' : 'Create New Lead'}
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g., CA, NY, TX"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Lead Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Lead Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source">Source *</Label>
                <Select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="mt-1"
                >
                  {SOURCES.map(source => (
                    <option key={source} value={source}>
                      {source.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </Select>
                {errors.source && (
                  <p className="text-red-600 text-sm mt-1">{errors.source}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1"
                >
                  {STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="score">Score (0-100)</Label>
                <Input
                  id="score"
                  name="score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={handleChange}
                  className="mt-1"
                />
                {errors.score && (
                  <p className="text-red-600 text-sm mt-1">{errors.score}</p>
                )}
              </div>

              <div>
                <Label htmlFor="leadValue">Lead Value ($)</Label>
                <Input
                  id="leadValue"
                  name="leadValue"
                  type="number"
                  min="0"
                  value={formData.leadValue}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  className="mt-1"
                />
                {errors.leadValue && (
                  <p className="text-red-600 text-sm mt-1">{errors.leadValue}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastActivityAt">Last Activity Date</Label>
                <Input
                  id="lastActivityAt"
                  name="lastActivityAt"
                  type="date"
                  value={formData.lastActivityAt}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isQualified"
                  name="isQualified"
                  type="checkbox"
                  checked={formData.isQualified}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isQualified">Is Qualified</Label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Lead' : 'Create Lead')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;