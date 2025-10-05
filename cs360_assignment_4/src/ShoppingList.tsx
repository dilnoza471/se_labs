import  { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface ShoppingItem {
  id: number;
  name: string;
  bought: boolean;
}

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: 1, name: 'Eggs', bought: false },
    { id: 2, name: 'Coffee', bought: false },
    { id: 3, name: 'Bananas', bought: false },
    { id: 4, name: 'Dog Treats', bought: true },
    { id: 5, name: 'Orange Juice', bought: true }
  ]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, {
        id: Date.now(),
        name: newItem.trim(),
        bought: false
      }]);
      setNewItem('');
    }
  };

  const toggleItem = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, bought: !item.bought } : item
    ));
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toBuyItems = items.filter(item => !item.bought);
  const boughtItems = items.filter(item => item.bought);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold text-center">Shopping List</h1>
          </div>

          {/* Add Item Section */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                placeholder="Add Item"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={addItem}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* To Buy Section */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">To Buy</h2>
            <div className="space-y-2">
              {toBuyItems.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No items to buy</p>
              ) : (
                toBuyItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 transition-colors"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-6 h-6 rounded-full border-2 border-gray-400 hover:border-indigo-600 transition-colors flex-shrink-0"
                    />
                    <span className="flex-1 text-gray-800 font-medium">{item.name}</span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bought Section */}
          {boughtItems.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">Bought</h2>
              <div className="space-y-2">
                {boughtItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-6 h-6 rounded-full border-2 bg-green-500 border-green-500 hover:bg-green-600 transition-colors flex items-center justify-center flex-shrink-0"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <span className="flex-1 text-gray-500 line-through font-medium">{item.name}</span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}