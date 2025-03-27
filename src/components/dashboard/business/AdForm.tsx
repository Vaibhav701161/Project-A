import React from 'react';
import { X } from 'lucide-react';

interface AdFormProps {
  onSubmit: (data: AdFormData) => Promise<void>;
  onClose: () => void;
}

export interface AdFormData {
  title: string;
  description: string;
  budget: string;
  duration: string;
  requirements: string[];
  category: string;
}

export function AdForm({ onSubmit, onClose }: AdFormProps) {
  const [formData, setFormData] = React.useState<AdFormData>({
    title: '',
    description: '',
    budget: '',
    duration: '',
    requirements: [''],
    category: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative animate-scale">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Create New Advertisement</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="e.g. $500-1000"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g. 2 weeks"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food & Dining</option>
              <option value="beauty">Beauty</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="technology">Technology</option>
              <option value="fitness">Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements
            </label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={e => updateRequirement(index, e.target.value)}
                  placeholder="e.g. Minimum 5k followers"
                  className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="text-sm text-blue-600 hover:text-blue-700 mt-2"
            >
              + Add Requirement
            </button>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Advertisement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}