"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const contentTypes = [
  "Blog Post",
  "Newsletter",
  "Product Description",
  "White Paper",
  "Case Study",
  "Social Media Post",
  "Press Release",
  "Technical Documentation",
  "Email Campaign",
  "Landing Page"
]

const initialJobs = [
  {
    id: "1",
    title: "Technical Documentation Update",
    client: "TechCorp Solutions",
    clientLogo: "/fintech-logo.png",
    description: "Update existing technical documentation to reflect new features and improvements",
    deadline: "2024-03-15",
    type: "Technical Documentation",
    credits: 600,
    prompt: `Create comprehensive technical documentation for our updated API endpoints. Include:
- Authentication methods
- Endpoint specifications
- Request/response examples
- Error handling
- Best practices`,
    generatedContent: "Initial content for technical documentation..."
  },
  {
    id: "2",
    title: "Blog Post Series",
    client: "HSBC",
    clientLogo: "/hsbc-logo.png",
    description: "Create a series of blog posts about emerging tech trends",
    deadline: "2024-03-10",
    type: "Blog Post",
    credits: 900,
    prompt: "Write a series of 3 blog posts covering AI, blockchain, and IoT trends...",
    generatedContent: "Draft content for blog series..."
  },
  {
    id: "3",
    title: "Product Description Updates",
    client: "SAP",
    clientLogo: "/sap-logo.png",
    description: "Optimize product descriptions for better conversion",
    deadline: "2024-03-01",
    type: "Product Description",
    credits: 300,
    prompt: "Update product descriptions to highlight key features and benefits...",
    generatedContent: "Updated product descriptions..."
  },
  {
    id: "4",
    title: "Technical White Paper",
    client: "Toshiba",
    clientLogo: "/toshiba-logo.png",
    description: "Create a detailed white paper on emerging semiconductor technologies",
    deadline: "2024-03-20",
    type: "White Paper",
    credits: 1200,
    prompt: "Write a comprehensive white paper on semiconductor advancements...",
    generatedContent: "White paper draft content..."
  }
]

export default function SearchPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState(initialJobs)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState<typeof initialJobs[0] | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showClaimDialog, setShowClaimDialog] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || job.type === typeFilter
    
    return matchesSearch && matchesType
  })

  const handleViewDetails = (job: typeof initialJobs[0]) => {
    setSelectedJob(job)
    setShowDetailsDialog(true)
  }

  const handleClaimJob = (job: typeof initialJobs[0]) => {
    setSelectedJob(job)
    setShowClaimDialog(true)
  }

  const confirmClaimJob = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove job from available jobs
      setJobs(jobs.filter(j => j.id !== selectedJob?.id))
      setShowClaimDialog(false)
      
      // Redirect to my jobs
      router.push('/editor/jobs')
    } catch (error) {
      setError("Failed to claim job. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8 gradient-bg min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Available Jobs</h1>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted"
                />
              </div>
              <div className="flex gap-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px] bg-muted">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {contentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">Client: {job.client}</p>
                  </div>
                  <p className="text-muted-foreground mt-2">{job.description}</p>
                </div>
                <div className="text-right">
                  <img 
                    src={job.clientLogo} 
                    alt={job.client}
                    className="h-8 w-auto object-contain mb-2"
                  />
                  <span className="text-xl font-semibold text-primary">
                    £{job.credits}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Due: {job.deadline}</span>
                </div>
                <Badge variant="secondary">{job.type}</Badge>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => handleViewDetails(job)}>
                  View Details
                </Button>
                <Button onClick={() => handleClaimJob(job)}>
                  Claim Job
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedJob.title}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedJob.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Client</h4>
                      <p>{selectedJob.client}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Payment</h4>
                      <p className="text-primary font-semibold">£{selectedJob.credits}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Type</h4>
                      <p>{selectedJob.type}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Deadline</h4>
                      <p>{selectedJob.deadline}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Prompt</h3>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {selectedJob.prompt}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Generated Content</h3>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {selectedJob.generatedContent}
                      </pre>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Claim Job</DialogTitle>
              <DialogDescription>
                Are you sure you want to claim this job? You can only have 5 active jobs at a time.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClaimDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmClaimJob} disabled={isSubmitting}>
                {isSubmitting ? "Claiming..." : "Confirm & Claim"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}