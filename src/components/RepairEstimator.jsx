import { useState, useEffect } from 'preact/hooks';
// During local development, point it directly to your Express port
const BACKEND_URL = 'http://localhost:3000';

export default function RepairEstimator() {
  // 1. State for dropdown selections
  const [selectedDevice, setSelectedDevice] = useState('');
  const [selectedRepair, setSelectedRepair] = useState('');
  
  // 2. State for API response data
  const [prices, setPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 3. Side effect: Fetch prices whenever device or repair selection changes
  useEffect(() => {
    // Only fetch if the user has selected both fields
    if (!selectedDevice || !selectedRepair) {
      setPrices([]);
      return;
    }

    const fetchPrices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build query string params (e.g., /api/prices?device=iPhone+12&repair=screen_repair)
        const queryParams = new URLSearchParams({
          device: selectedDevice,
          repair: selectedRepair
        });

        const response = await fetch(`${BACKEND_URL}/api/prices?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch pricing options.');
        }

        const data = await response.json();
        setPrices(data); // Expecting an array of price options
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, [selectedDevice, selectedRepair]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Repair Estimator</h2>

      {/* Device Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Device</label>
        <select 
          value={selectedDevice} 
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">-- Choose a device --</option>
          <option value="iphone12">iPhone 12</option>
          <option value="iphone13">iPhone 13</option>
          <option value="iphone14">iPhone 14</option>
        </select>
      </div>

      {/* Repair Type Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Repair</label>
        <select 
          value={selectedRepair} 
          onChange={(e) => setSelectedRepair(e.target.value)}
          className="w-full p-2 border rounded-md"
          disabled={!selectedDevice} // Optional: keep disabled until device is chosen
        >
          <option value="">-- Choose repair type --</option>
          <option value="screen_repair">Screen Repair</option>
          <option value="battery_replacement">Battery Replacement</option>
          <option value="charging_port">Charging Port</option>
        </select>
      </div>

      {/* Price Results Display Area */}
      <div className="mt-6 border-t pt-4">
        {isLoading && <p className="text-gray-500 animate-pulse">Fetching latest prices...</p>}
        
        {error && <p className="text-red-500">Error: {error}</p>}

        {!isLoading && !error && prices.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Pricing Options:</h3>
            <ul className="space-y-2">
              {prices.map((option, index) => (
                <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                  <div>
                    <span className="font-medium text-gray-800">{option.tier}</span>
                    {option.description && <p className="text-xs text-gray-500">{option.description}</p>}
                  </div>
                  <span className="text-green-600 font-bold">${option.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isLoading && !error && prices.length === 0 && selectedDevice && selectedRepair && (
          <p className="text-gray-500 text-sm">No pricing tiers available for this selection.</p>
        )}
      </div>
    </div>
  );
}