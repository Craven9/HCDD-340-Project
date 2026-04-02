import { useState, useRef, useEffect } from 'react';
import { Camera as CameraIcon, X, Check, Upload, Sparkles, AlertCircle, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../lib/expenseData';

interface ReceiptItem {
  id: string;
  description: string;
  amount: string;
}

interface ExtractedData {
  merchant: string;
  date: string;
  items: ReceiptItem[];
  confidence: number;
  transactionType: 'Cash' | 'Bank Transfer' | 'Credit' | 'Debit';
  category: string;
}

export function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [editedData, setEditedData] = useState<ExtractedData | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [mode, setMode] = useState<'camera' | 'upload'>('upload');

  // Start camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera access was denied. Please allow camera permissions in your browser settings or use the upload option.');
        } else if (error.name === 'NotFoundError') {
          setCameraError('No camera found on this device. Please use the upload option.');
        } else if (error.name === 'NotSupportedError') {
          setCameraError('Camera is not supported in this environment. Please use the upload option.');
        } else {
          setCameraError('Unable to access camera. Please use the upload option instead.');
        }
      } else {
        setCameraError('Unable to access camera. Please use the upload option instead.');
      }
      // Automatically switch to upload mode
      setMode('upload');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        processImage(imageData);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate AI processing of receipt
  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic itemized receipt
    const merchant = generateMockMerchant();
    const itemCount = Math.floor(Math.random() * 4) + 2; // 2-5 items
    const items: ReceiptItem[] = [];
    
    for (let i = 0; i < itemCount; i++) {
      items.push({
        id: `${Date.now()}-${i}`,
        description: generateMockItem(merchant),
        amount: generateMockAmount(),
      });
    }
    
    // Mock AI extraction - in a real app, this would call an OCR/AI service
    const mockExtraction: ExtractedData = {
      merchant: merchant,
      date: new Date().toISOString().split('T')[0],
      items: items,
      confidence: Math.random() * 0.15 + 0.85, // 85-100% confidence
      transactionType: 'Credit', // Default transaction type
      category: generateMockCategoryForMerchant(merchant)
    };
    
    setExtractedData(mockExtraction);
    setEditedData(mockExtraction);
    setIsProcessing(false);
  };

  // Mock data generators
  const generateMockMerchant = () => {
    const merchants = [
      'Whole Foods Market',
      'Target',
      'Starbucks',
      'Shell Gas Station',
      'CVS Pharmacy',
      'Trader Joe\'s',
      'Amazon',
      'Uber',
      'Restaurant - The Grill',
      'Best Buy'
    ];
    return merchants[Math.floor(Math.random() * merchants.length)];
  };

  const generateMockItem = (merchant: string) => {
    const items: { [key: string]: string[] } = {
      'Whole Foods Market': ['Organic Apples', 'Almond Milk', 'Whole Wheat Bread', 'Fresh Salmon', 'Kale Salad'],
      'Target': ['Paper Towels', 'Laundry Detergent', 'Shampoo', 'T-Shirt', 'Storage Bins'],
      'Starbucks': ['Grande Latte', 'Breakfast Sandwich', 'Croissant', 'Iced Coffee', 'Protein Box'],
      'Shell Gas Station': ['Regular Gas', 'Energy Drink', 'Chips', 'Car Wash', 'Bottled Water'],
      'CVS Pharmacy': ['Pain Reliever', 'Vitamins', 'Band-Aids', 'Toothpaste', 'Hand Sanitizer'],
      'Trader Joe\'s': ['Two-Buck Chuck Wine', 'Frozen Pizza', 'Trail Mix', 'Mandarin Oranges', 'Hummus'],
      'Amazon': ['USB Cable', 'Phone Case', 'Book', 'HDMI Cable', 'Desk Organizer'],
      'Uber': ['Uber Trip - Downtown', 'Uber Eats - Delivery', 'Uber Pool', 'Uber XL', 'Uber Comfort'],
      'Restaurant - The Grill': ['Grilled Chicken', 'Caesar Salad', 'French Fries', 'Soft Drink', 'Cheesecake'],
      'Best Buy': ['HDMI Cable', 'USB Drive', 'Phone Charger', 'Laptop Sleeve', 'Screen Protector']
    };
    
    const merchantItems = items[merchant] || ['Item', 'Product', 'Service'];
    return merchantItems[Math.floor(Math.random() * merchantItems.length)];
  };

  const generateMockAmount = () => {
    return (Math.random() * 50 + 2).toFixed(2);
  };

  const generateMockCategoryForMerchant = (merchant: string) => {
    const categoryMap: { [key: string]: string } = {
      'Whole Foods Market': 'Food & Dining',
      'Target': 'Shopping',
      'Starbucks': 'Food & Dining',
      'Shell Gas Station': 'Transportation',
      'CVS Pharmacy': 'Healthcare',
      'Trader Joe\'s': 'Food & Dining',
      'Amazon': 'Shopping',
      'Uber': 'Transportation',
      'Restaurant - The Grill': 'Food & Dining',
      'Best Buy': 'Shopping'
    };
    
    return categoryMap[merchant] || 'Other';
  };

  const generateMockCategory = () => {
    const categoryWeights = [
      'Food & Dining',
      'Food & Dining',
      'Food & Dining',
      'Shopping',
      'Shopping',
      'Transportation',
      'Healthcare',
      'Entertainment'
    ];
    return categoryWeights[Math.floor(Math.random() * categoryWeights.length)];
  };

  // Reset and retake
  const retakePhoto = () => {
    setCapturedImage(null);
    setExtractedData(null);
    setEditedData(null);
    if (mode === 'camera') {
      startCamera();
    }
  };

  // Submit to expenses
  const submitExpense = () => {
    if (editedData && editedData.items && editedData.items.length > 0) {
      // Create a single grouped expense with receipt items
      const totalAmount = editedData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      
      const newExpense = {
        id: Date.now().toString(),
        description: editedData.merchant,
        amount: totalAmount,
        category: editedData.category,
        date: editedData.date,
        aiConfidence: editedData.confidence,
        tags: ['receipt-scan'],
        receipt: capturedImage,
        receiptItems: editedData.items.map(item => ({
          id: item.id,
          description: item.description,
          amount: parseFloat(item.amount) || 0,
          category: editedData.category // Use the same category for all items
        })),
        transactionType: editedData.transactionType
      };
      
      // Get existing expenses from localStorage or use empty array
      const existingExpenses = JSON.parse(localStorage.getItem('scannedExpenses') || '[]');
      existingExpenses.push(newExpense);
      localStorage.setItem('scannedExpenses', JSON.stringify(existingExpenses));
      
      // Navigate to expenses page
      navigate('/expenses');
    }
  };

  // Initialize camera on mount
  useEffect(() => {
    if (mode === 'camera' && !capturedImage) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [mode]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Receipt Scanner</h2>
        <p className="text-sm text-gray-500">Capture or upload receipts and let AI extract the details</p>
      </div>

      {/* Mode Toggle */}
      {!capturedImage && (
        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 w-fit">
          <button
            onClick={() => {
              setMode('camera');
              setCameraError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              mode === 'camera' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CameraIcon className="w-4 h-4" />
            Camera
          </button>
          <button
            onClick={() => {
              setMode('upload');
              stopCamera();
              setCameraError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              mode === 'upload' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Side - Camera/Upload or Captured Image */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {!capturedImage ? (
            <>
              {mode === 'camera' ? (
                <div className="relative">
                  {cameraError ? (
                    <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center p-6">
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-4">{cameraError}</p>
                        <button
                          onClick={() => setMode('upload')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Switch to Upload
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full aspect-[4/3] bg-gray-900 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                        <button
                          onClick={capturePhoto}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <CameraIcon className="w-5 h-5" />
                          Capture Receipt
                        </button>
                      </div>
                    </>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Upload a receipt image</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured receipt" 
                className="w-full aspect-[4/3] object-cover"
              />
              {!isProcessing && (
                <button
                  onClick={retakePhoto}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                  title="Retake photo"
                >
                  <RotateCcw className="w-5 h-5 text-gray-700" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Side - AI Extraction & Editing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!capturedImage ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Capture or upload a receipt to begin</p>
              </div>
            </div>
          ) : isProcessing ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-700 mb-2">AI Processing Receipt...</p>
                <p className="text-sm text-gray-500">Extracting expense details</p>
              </div>
            </div>
          ) : extractedData && editedData ? (
            <div className="h-full flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-gray-900">Extracted Details</h3>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">AI Confidence</span>
                    <span className="text-sm text-purple-600 font-medium">
                      {(extractedData.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-white/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${extractedData.confidence * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">Review and edit the details before submitting</p>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Merchant / Description</label>
                  <input
                    type="text"
                    value={editedData.merchant}
                    onChange={(e) => setEditedData({ ...editedData, merchant: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={editedData.date}
                    onChange={(e) => setEditedData({ ...editedData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Transaction Type</label>
                  <select
                    value={editedData.transactionType}
                    onChange={(e) => setEditedData({ ...editedData, transactionType: e.target.value as 'Cash' | 'Bank Transfer' | 'Credit' | 'Debit' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit">Credit</option>
                    <option value="Debit">Debit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Category</label>
                  <select
                    value={editedData.category}
                    onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm text-gray-700">Items</label>
                    <button
                      onClick={() => {
                        const newItem: ReceiptItem = {
                          id: Date.now().toString(),
                          description: '',
                          amount: '0.00'
                        };
                        setEditedData({ ...editedData, items: [...editedData.items, newItem] });
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Add Item
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {editedData.items.map((item, index) => (
                      <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-xs text-gray-500 mt-2 flex-shrink-0">#{index + 1}</span>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              placeholder="Item description"
                              value={item.description}
                              onChange={(e) => {
                                const updatedItems = editedData.items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i);
                                setEditedData({ ...editedData, items: updatedItems });
                              }}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={item.amount}
                                onChange={(e) => {
                                  const updatedItems = editedData.items.map(i => i.id === item.id ? { ...i, amount: e.target.value } : i);
                                  setEditedData({ ...editedData, items: updatedItems });
                                }}
                                className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (editedData.items.length > 1) {
                                const updatedItems = editedData.items.filter(i => i.id !== item.id);
                                setEditedData({ ...editedData, items: updatedItems });
                              }
                            }}
                            disabled={editedData.items.length === 1}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Total Amount</span>
                      <span className="text-lg font-semibold text-blue-700">
                        ${editedData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={retakePhoto}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={submitExpense}
                  disabled={!editedData.merchant || !editedData.items.some(item => item.amount)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Add to Expenses
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

