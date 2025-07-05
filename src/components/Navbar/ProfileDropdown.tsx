export default function ProfileDropdown() {
  return (
    <div className="absolute right-0 mt-12 w-64 bg-white shadow rounded-md animate-fade-in z-50 border">
      <div className="flex items-center gap-3 p-4 border-b">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
          U
        </div>
        <div>
          <p className="font-semibold">Username</p>
          <button className="text-blue-500 text-xs hover:underline">View profile</button>
        </div>
      </div>
      <ul className="text-sm divide-y">
        <li className="p-3 hover:bg-gray-100 cursor-pointer">Last updates</li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer">Get help</li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer">Help center</li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer">Shortcuts</li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer">Send feedback</li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer">Privacy policy</li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer text-red-500">Close session</li>
      </ul>
    </div>
  );
}
