const Card = () => {
    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl animate-fade-in-up">
            <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Card Title</div>
                <p className="mt-2 text-gray-500">This is a beautiful card with a smooth fade-in animation.</p>
            </div>
        </div>
    );
}
export default Card;