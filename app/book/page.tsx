export default function Book() {
  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Book a Service</h2>
      <form className="space-y-4">
        <input className="w-full border p-2" placeholder="Phone number" />
        <button className="w-full bg-black text-white p-2">Send OTP</button>
      </form>
    </div>
  )
}