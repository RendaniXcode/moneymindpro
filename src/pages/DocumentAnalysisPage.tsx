import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentUploader from '@/components/document/DocumentUploader';
import { s3Service } from '@/services/s3Service';
import { FileText, FileUp, BarChart, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface Document {
  name: string;
  key: string;
  url: string;
  size: number;
  lastModified?: Date;
  analyzed?: boolean;
}

const DocumentAnalysisPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Load documents from S3
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const financialDocs = await s3Service.listFiles('financial-statements');
      
      // Convert to our document format
      const docs = financialDocs.map(file => ({
        name: file.name,
        key: file.key,
        url: file.url,
        size: file.size,
        lastModified: file.lastModified,
        analyzed: false // We'd track this in a database in a real app
      }));
      
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Error loading documents',
        description: 'Could not load your documents. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load documents on component mount
  useEffect(() => {
    loadDocuments();
  }, []);

  // Handle successful upload
  const handleUploadComplete = (result: any) => {
    // Add the new document to the list
    const newDoc: Document = {
      name: result.fileName,
      key: result.key,
      url: result.s3Location,
      size: 0, // We don't have the size from the upload result
      analyzed: false
    };
    
    setDocuments(prev => [newDoc, ...prev]);
  };

  // Simulate document analysis
  const analyzeDocument = async (doc: Document) => {
    if (!doc) return;
    
    setSelectedDocument(doc);
    setAnalyzing(true);
    
    // Simulate API call for analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update the document to mark as analyzed
    setDocuments(prev => 
      prev.map(d => d.key === doc.key ? {...d, analyzed: true} : d)
    );
    
    setAnalyzing(false);
    
    toast({
      title: 'Analysis complete',
      description: `${doc.name} has been analyzed`,
    });
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Document Upload and List Panel */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Analysis</CardTitle>
              <CardDescription>
                Upload financial documents for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUploader onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Your Documents</CardTitle>
                <Button variant="outline" size="sm" onClick={loadDocuments} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No documents uploaded yet</p>
                  <p className="text-sm">Upload a document to get started</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {documents.map((doc, i) => (
                    <div 
                      key={i} 
                      className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <FileText className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(doc.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      {doc.analyzed ? (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50">
                          Analyzed
                        </Badge>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            analyzeDocument(doc);
                          }}
                        >
                          Analyze
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Document Preview and Analysis Panel */}
        <div className="w-full lg:w-2/3">
          <Card className="h-full">
            {selectedDocument ? (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedDocument.name}</CardTitle>
                      <CardDescription>
                        {new Date(selectedDocument.lastModified || Date.now()).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={selectedDocument.url} target="_blank" rel="noopener noreferrer">
                          View Document
                        </a>
                      </Button>
                      {!selectedDocument.analyzed && (
                        <Button 
                          size="sm" 
                          onClick={() => analyzeDocument(selectedDocument)}
                          disabled={analyzing}
                        >
                          {analyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <BarChart className="h-4 w-4 mr-2" />
                              Analyze
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <Tabs defaultValue="preview">
                    <TabsList className="mb-4">
                      <TabsTrigger value="preview">Document Preview</TabsTrigger>
                      <TabsTrigger value="analysis" disabled={!selectedDocument.analyzed}>
                        Analysis Results
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="pt-2">
                      <div className="border rounded-md overflow-hidden h-[600px]">
                        <iframe 
                          src={selectedDocument.url} 
                          className="w-full h-full" 
                          title={selectedDocument.name}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="analysis">
                      {selectedDocument.analyzed ? (
                        <div className="p-4 border rounded-md">
                          <h3 className="text-lg font-medium mb-4">Document Analysis Results</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Key Financial Metrics</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="p-3 bg-blue-50 rounded-md">
                                  <p className="text-xs text-blue-500 font-medium">Revenue</p>
                                  <p className="text-lg font-bold">$1,245,300</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-md">
                                  <p className="text-xs text-green-500 font-medium">Net Profit</p>
                                  <p className="text-lg font-bold">$356,200</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-md">
                                  <p className="text-xs text-purple-500 font-medium">Cash Flow</p>
                                  <p className="text-lg font-bold">$892,100</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">AI Summary</h4>
                              <p className="text-muted-foreground">
                                This financial statement shows strong performance with revenues increasing by 12% year-over-year.
                                Profit margins have improved to 28.6%, above industry average of 22%. 
                                Cash flow from operations remains strong, providing good liquidity for the company.
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Risk Assessment</h4>
                              <div className="p-3 border rounded-md bg-amber-50">
                                <p className="text-sm">
                                  <span className="font-medium text-amber-600">Moderate Risk: </span>
                                  While overall financial health is strong, increasing debt levels warrant monitoring in the coming quarters.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-20 text-muted-foreground">
                          <BarChart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                          <p className="text-lg font-medium">Document not analyzed yet</p>
                          <p className="max-w-md mx-auto mt-1">
                            Click the Analyze button to extract insights from this document
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[700px] text-muted-foreground">
                <FileText className="h-16 w-16 mb-4 opacity-20" />
                <h3 className="text-xl font-medium mb-2">No Document Selected</h3>
                <p className="text-center max-w-md">
                  Select a document from the list or upload a new document to view and analyze it
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysisPage;
