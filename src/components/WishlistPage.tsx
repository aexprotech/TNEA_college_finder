import React, { useState } from 'react';
import { 
  Trash2, 
  MapPin, 
  Award, 
  TrendingUp, 
  Edit, 
  Save, 
  X, 
  Move, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Heart,
  Target,
  Navigation,
  Star,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { firestoreService } from '../services/firestore';
import { SmartSearchResult } from '../App';
import { useDrag, useDrop } from 'react-dnd';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface WishlistPageProps {
  wishlistItems: SmartSearchResult[];
  removeFromWishlist: (college: SmartSearchResult) => Promise<void>;
  userId: string;
  refreshWishlist: () => Promise<void>; // Changed to return Promise
}

const ItemTypes = {
  COLLEGE: 'college',
};

const DraggableCollege: React.FC<{
  college: SmartSearchResult;
  index: number;
  moveCollege: (dragIndex: number, hoverIndex: number) => void;
  removeFromWishlist: (college: SmartSearchResult) => Promise<void>;
  userId: string;
  refreshWishlist: () => Promise<void>;
  moveCollegeUp: (index: number) => void;
  moveCollegeDown: (index: number) => void;
}> = ({ college, index, moveCollege, removeFromWishlist, userId, refreshWishlist, moveCollegeUp, moveCollegeDown }) => {
  const [editingNotesFor, setEditingNotesFor] = useState<string | null>(null);
  const [currentNotes, setCurrentNotes] = useState(college.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const ref = React.useRef<HTMLTableRowElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COLLEGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.COLLEGE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveCollege(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const startEditing = () => {
    setEditingNotesFor(String(college.id));
    setCurrentNotes(college.notes || "");
  };

  const cancelEditing = () => {
    setEditingNotesFor(null);
  };

  const saveNotes = async () => {
    if (!userId) {
      toast.error('Please login to save notes');
      return;
    }
    
    setIsSaving(true);
    try {
      await firestoreService.saveNotes(userId, String(college.id), currentNotes);
      await refreshWishlist();
      setEditingNotesFor(null);
      toast.success('Notes saved successfully!');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) {
      toast.error('Please login to remove items');
      return;
    }
    
    setIsDeleting(true);
    try {
      await removeFromWishlist(college);
      toast.success('College removed from wishlist!');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove college. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr
      ref={ref}
      className={`border-b ${isDragging ? 'opacity-50 bg-gray-100' : 'opacity-100 hover:bg-blue-50/30'} transition-colors`}
      style={{ cursor: 'move' }}
    >
      {/* Priority Number */}
      <td className="py-4 px-2 text-center">
        <div className="w-8 h-8 rounded-full bg-blue-100/80 flex items-center justify-center mx-auto">
          <span className="text-blue-800 font-bold">{index + 1}</span>
        </div>
      </td>

      {/* College Info */}
      <td className="py-4 px-4">
        <div className="font-bold text-gray-900 text-lg">
          {college.college_name}
        </div>
        <div className="flex items-center text-sm text-gray-700 mt-2">
          <Award className="h-4 w-4 mr-1.5 text-blue-500" />
          <span className="font-semibold">{college.branch_name}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mt-1.5">
          <MapPin className="h-4 w-4 mr-1.5 text-green-500" />
          <span>{college.district}</span>
        </div>
      </td>

      {/* Cutoff Marks */}
      <td className="py-4 px-4">
        {college.cutoff_mark_2024 && (
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1.5 text-green-600" />
            <span className="font-bold text-green-700">
              2024: {college.cutoff_mark_2024}
            </span>
          </div>
        )}
        {college.cutoff_mark_2023 && (
          <div className="flex items-center text-sm text-gray-600 mt-2">
            <TrendingUp className="h-4 w-4 mr-1.5 text-gray-400" />
            <span className="font-medium">
              2023: {college.cutoff_mark_2023}
            </span>
          </div>
        )}
      </td>

      {/* Ranking */}
      <td className="py-4 px-4 text-center">
        {college.ranking && college.ranking !== 'N/A' ? (
          <span className="inline-flex items-center bg-purple-100/70 text-purple-800 px-3 py-1 rounded-full text-sm">
            <Star className="h-4 w-4 mr-1" />
            NIRF {college.ranking}
          </span>
        ) : (
          <span className="text-gray-400">N/A</span>
        )}
      </td>

      {/* Notes Section */}
      <td className="py-4 px-4">
        {editingNotesFor === String(college.id) ? (
          <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200">
            <textarea
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              className="w-full p-2 border border-blue-300/50 rounded text-sm bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              rows={3}
              placeholder="Add your notes about this college..."
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                onClick={cancelEditing}
                className="px-3 py-1 bg-gray-200 rounded-md text-sm flex items-center hover:bg-gray-300 transition-colors"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={saveNotes}
                disabled={isSaving}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className={`p-3 rounded-lg ${college.notes ? 'bg-yellow-50/60 border border-yellow-200' : 'bg-gray-50/60 border border-gray-200'}`}>
            <div className="flex items-start">
              <ClipboardList className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${college.notes ? 'text-yellow-500' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="text-sm whitespace-pre-wrap text-gray-700">
                  {college.notes || 'No notes added'}
                </div>
                <button
                  onClick={startEditing}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-xs flex items-center transition-colors"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {college.notes ? "Edit Notes" : "Add Notes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center justify-center space-x-1">
          <button
            onClick={() => moveCollegeUp(index)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => moveCollegeDown(index)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
            title="Remove"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

const WishlistPage: React.FC<WishlistPageProps> = ({ 
  wishlistItems, 
  removeFromWishlist,
  userId,
  refreshWishlist
}) => {
  const [orderedItems, setOrderedItems] = useState<SmartSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadOrder = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const [savedOrder, currentWishlist] = await Promise.all([
          firestoreService.getWishlistOrder(userId),
          firestoreService.getWishlist(userId)
        ]);

        if (savedOrder?.length > 0) {
          const itemsMap = new Map(currentWishlist.map(item => [String(item.id), item]));
          const reorderedItems = savedOrder
            .map(id => itemsMap.get(id))
            .filter(Boolean) as SmartSearchResult[];
          const newItems = currentWishlist.filter(item => !savedOrder.includes(String(item.id)));
          setOrderedItems([...reorderedItems, ...newItems]);
        } else {
          setOrderedItems(currentWishlist);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
        toast.error('Failed to load wishlist');
        setOrderedItems(wishlistItems);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrder();
  }, [wishlistItems, userId]);

  const moveCollege = async (dragIndex: number, hoverIndex: number) => {
    const newOrderedItems = [...orderedItems];
    const draggedItem = newOrderedItems[dragIndex];
    newOrderedItems.splice(dragIndex, 1);
    newOrderedItems.splice(hoverIndex, 0, draggedItem);
    setOrderedItems(newOrderedItems);
    
    if (userId) {
      try {
        const newOrder = newOrderedItems.map(item => String(item.id));
        await firestoreService.setWishlistOrder(userId, newOrder);
      } catch (error) {
        console.error('Error saving wishlist order:', error);
        toast.error('Failed to save order changes');
      }
    }
  };

  const moveCollegeUp = (index: number) => {
    if (index > 0) {
      moveCollege(index, index - 1);
    }
  };

  const moveCollegeDown = (index: number) => {
    if (index < orderedItems.length - 1) {
      moveCollege(index, index + 1);
    }
  };

  const exportToPDF = async () => {
    const table = document.querySelector('table');
    if (!table) return;
    const pdf = new jsPDF('p', 'pt', 'a4');
    const scale = 2;
    const canvas = await html2canvas(table, { scale });
    const imgData = canvas.toDataURL('image/png');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 40;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
    pdf.save('wishlist.pdf');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (orderedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 text-blue-400 mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600">Start adding colleges to your wishlist while searching!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <Heart className="h-8 w-8 mr-2 text-red-500" fill="currentColor" />
          My Wishlist ({orderedItems.length})
        </h1>
        
        <div className="bg-blue-100 border-l-4 border-blue-500 rounded-lg p-4 mb-6 flex items-center">
          <div className="flex-1">
            <h3 className="font-medium text-blue-800 flex items-center">
              <Navigation className="h-5 w-5 mr-2" />
              Reorder your preferences:
            </h3>
            <p className="text-sm text-blue-700">
              Use drag and drop to reorder colleges or click the up/down arrows. Your preference order is important for TNEA counseling.
            </p>
          </div>
          <Move className="h-6 w-6 text-blue-500" />
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8 border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th scope="col" className="px-2 py-3 text-center text-xs font-medium text-blue-800 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                  College & Branch
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                  Cutoff
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-blue-800 uppercase tracking-wider">
                  NIRF Rank
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                  Notes
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-blue-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderedItems.map((college, index) => (
                <DraggableCollege
                  key={String(college.id)}
                  index={index}
                  college={college}
                  moveCollege={moveCollege}
                  removeFromWishlist={removeFromWishlist}
                  userId={userId}
                  refreshWishlist={refreshWishlist}
                  moveCollegeUp={moveCollegeUp}
                  moveCollegeDown={moveCollegeDown}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            How to use your wishlist:
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Drag colleges up/down or use arrows to set your preference order</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Add detailed notes about each college for reference</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Export your final list as image or PDF to use while filling TNEA preferences</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Keep this list handy during the actual TNEA counseling process</span>
            </li>
          </ul>
          <button
            onClick={exportToPDF}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;