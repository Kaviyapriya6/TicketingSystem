'use client'
import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Plus,
  Info,
  Globe,
  Copy,
  ChevronDown,
  ChevronUp,
  Trash2,
  PencilLine,
  Save,
  Eye
} from 'lucide-react';

export default function CMSEditor({ onSubmit, initialData = {}, isEdit = false }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [selectedHierarchy, setSelectedHierarchy] = useState(initialData.hierarchy || '');
  const [tags, setTags] = useState(initialData.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [seoTitle, setSeoTitle] = useState(initialData.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialData.seoDescription || '');
  const [templatesExpanded, setTemplatesExpanded] = useState(true);
  const [propertiesExpanded, setPropertiesExpanded] = useState(true);
  const [seoExpanded, setSeoExpanded] = useState(true);
  const [isPublished, setIsPublished] = useState(initialData.isPublished || false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });
  
  // Dialog states
  const [linkDialog, setLinkDialog] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  
  const contentRef = useRef(null);

  const templates = [
    '[Sample] User Guide template',
    '[Sample] How to template',
    '[Sample] FAQ template'
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ open: true, message, type });
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  // Text formatting functions
  const formatText = (formatType) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    
    switch (formatType) {
      case 'bold':
        formattedText = selectedText ? `**${selectedText}**` : '**bold text**';
        break;
      case 'italic':
        formattedText = selectedText ? `*${selectedText}*` : '*italic text*';
        break;
      case 'underline':
        formattedText = selectedText ? `<u>${selectedText}</u>` : '<u>underlined text</u>';
        break;
      case 'bulletList':
        formattedText = selectedText ? `• ${selectedText}` : '• List item';
        break;
      case 'numberedList':
        formattedText = selectedText ? `1. ${selectedText}` : '1. List item';
        break;
      case 'code':
        formattedText = selectedText ? `\`${selectedText}\`` : '`code`';
        break;
      case 'heading1':
        formattedText = selectedText ? `# ${selectedText}` : '# Heading 1';
        break;
      case 'heading2':
        formattedText = selectedText ? `## ${selectedText}` : '## Heading 2';
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    showNotification(`${formatType} formatting applied`);
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const linkMarkdown = `[${linkText}](${linkUrl})`;
      const textarea = contentRef.current;
      const start = textarea.selectionStart;
      const newContent = content.substring(0, start) + linkMarkdown + content.substring(start);
      setContent(newContent);
      setLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
      showNotification('Link inserted successfully');
    }
  };

  const insertImage = () => {
    if (imageUrl) {
      const imageMarkdown = `![${imageAlt || 'Image'}](${imageUrl})`;
      const textarea = contentRef.current;
      const start = textarea.selectionStart;
      const newContent = content.substring(0, start) + imageMarkdown + content.substring(start);
      setContent(newContent);
      setImageDialog(false);
      setImageUrl('');
      setImageAlt('');
      showNotification('Image inserted successfully');
    }
  };

  const insertTable = () => {
    const tableMarkdown = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |
| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |
`;
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + tableMarkdown + content.substring(start);
    setContent(newContent);
    showNotification('Table inserted successfully');
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !selectedHierarchy) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    // Prepare the article data
    const articleData = {
      title,
      content,
      hierarchy: selectedHierarchy,
      tags,
      seoTitle,
      seoDescription,
      published: false,
      createdAt: isEdit ? initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (onSubmit) {
        await onSubmit(articleData);
      } else {
        showNotification('Article saved successfully');
      }
    } catch (err) {
      showNotification('Error saving article', 'error');
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim() || !selectedHierarchy) {
      showNotification('Please fill all required fields', 'error');
      return;
    }
    setIsPublished(true);

    // Prepare the article data
    const articleData = {
      title,
      content,
      hierarchy: selectedHierarchy,
      tags,
      seoTitle,
      seoDescription,
      published: true,
      createdAt: isEdit ? initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (onSubmit) {
        await onSubmit(articleData);
      } else {
        // Default behavior - send to backend
        const res = await fetch('/api/solutions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData),
        });
        if (res.ok) {
          showNotification('Article published successfully');
        } else {
          showNotification('Failed to publish article', 'error');
        }
      }
    } catch (err) {
      showNotification('Error publishing article', 'error');
    }
  };

  const handlePreview = () => {
    showNotification('Opening preview...');
  };

  const loadTemplate = (templateName) => {
    let templateContent = '';
    switch (templateName) {
      case '[Sample] User Guide template':
        templateContent = `# User Guide

## Overview
Brief description of what this guide covers.

## Prerequisites
- Requirement 1
- Requirement 2

## Step-by-Step Instructions

### Step 1: Getting Started
Instructions for the first step.

### Step 2: Configuration
Instructions for configuration.

### Step 3: Testing
Instructions for testing.

## Troubleshooting
Common issues and solutions.

## Support
Contact information for additional help.`;
        break;
      case '[Sample] How to template':
        templateContent = `# How to [Task Name]

## What You'll Learn
Brief description of the outcome.

## Before You Begin
- Prerequisites
- Required tools/access

## Instructions

1. **First Step**
   Detailed explanation of the first step.

2. **Second Step**
   Detailed explanation of the second step.

3. **Final Step**
   Detailed explanation of the final step.

## Verification
How to verify the task was completed successfully.

## Next Steps
What to do after completing this task.`;
        break;
      case '[Sample] FAQ template':
        templateContent = `# Frequently Asked Questions

## General Questions

**Q: What is this service?**
A: Brief description of the service.

**Q: How do I get started?**
A: Step-by-step getting started instructions.

**Q: What are the system requirements?**
A: List of system requirements.

## Technical Questions

**Q: How do I troubleshoot common issues?**
A: Troubleshooting steps.

**Q: Where can I find more documentation?**
A: Links to additional resources.

## Contact

For questions not covered here, please contact [support information].`;
        break;
      default:
        templateContent = '';
    }
    
    setContent(templateContent);
    showNotification(`Template "${templateName}" loaded successfully`);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Main Editor Area */}
      <div className="flex-1 p-6">
        {/* Top Action Bar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-slate-900">
              {isEdit ? 'Edit Article' : 'Article Editor'}
            </h1>
            {isPublished && (
              <Badge variant="success" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Published
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? 'Update' : 'Save'}
            </Button>
            <Button
              variant="default"
              onClick={handlePublish}
              disabled={!title.trim() || !content.trim()}
            >
              {isEdit ? 'Update & Publish' : (isPublished ? 'Update' : 'Publish')}
            </Button>
          </div>
        </div>

        {/* Title Input */}
        <Input
          placeholder="Enter article title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 text-2xl font-medium"
        />

        {/* Editor */}
        <RichTextEditor
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your article here..."
        />

        {/* Article Stats */}
        <div className="mt-4 flex gap-4 text-sm text-slate-600">
          <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
          <span>Characters: {content.length}</span>
          <span>Reading time: ~{Math.ceil(content.split(/\s+/).filter(word => word.length > 0).length / 200)} min</span>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[350px] bg-white border-l border-slate-200 p-4">
        {/* Templates Section */}
        <Accordion type="single" collapsible defaultValue="templates">
          <AccordionItem value="templates">
            <AccordionTrigger className="text-sm font-semibold">
              TEMPLATES ({templates.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {templates.map((template, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-slate-500" />
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => loadTemplate(template)}
                    >
                      {template}
                    </button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Article Properties Section */}
          <AccordionItem value="properties">
            <AccordionTrigger className="text-sm font-semibold">
              ARTICLE PROPERTIES
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5">Select hierarchy *</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedHierarchy}
                      onValueChange={setSelectedHierarchy}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hierarchy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOW TO'S">HOW TO'S</SelectItem>
                        <SelectItem value="FAQ">FAQ</SelectItem>
                        <SelectItem value="Troubleshooting">Troubleshooting</SelectItem>
                        <SelectItem value="User Guides">User Guides</SelectItem>
                        <SelectItem value="API Documentation">API Documentation</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      New folder
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="mb-1.5">Tags</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add tags and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                    />
                    <Button variant="outline" size="sm" onClick={handleTagAdd}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleTagDelete(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Published</Label>
                  <Switch
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* SEO Section */}
          <AccordionItem value="seo">
            <AccordionTrigger className="text-sm font-semibold">
              SEARCH ENGINE OPTIMISATION
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5">Title for search engine</Label>
                  <Input
                    placeholder="Type article title for SEO"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                  <p className="mt-1 text-sm text-slate-500">
                    {seoTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label className="mb-1.5">Description for search engine</Label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Type article description for SEO"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                  />
                  <p className="mt-1 text-sm text-slate-500">
                    {seoDescription.length}/160 characters
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Bottom Icons */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
          <div className="flex gap-4">
            <button className="text-slate-600 hover:text-slate-900">
              <Info className="h-5 w-5" />
            </button>
            <button className="text-slate-600 hover:text-slate-900">
              <Globe className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-semibold">
              {tags.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Link Dialog */}
      <Dialog open={linkDialog} onOpenChange={setLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Link Text</Label>
              <Input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={insertLink} disabled={!linkUrl || !linkText}>
              Insert Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialog} onOpenChange={setImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Describe the image"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={insertImage} disabled={!imageUrl}>
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification */}
      {notification.open && (
        <Alert
          variant={notification.type === 'error' ? 'destructive' : 'default'}
          className="fixed bottom-4 right-4 max-w-md"
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}