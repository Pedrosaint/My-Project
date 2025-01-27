import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { db, auth } from "../Firebase/Firebase"; // Import Firebase setup
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore"; // Import Firestore functions
import { onAuthStateChanged } from "firebase/auth"; // To track user authentication state

const Testimonial = () => {
  const [user, setUser] = useState(null); // Track the logged-in user
  const [comments, setComments] = useState([]); // Store comments from Firestore
  const [newComment, setNewComment] = useState(""); // Track new comment input

  // Track user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  // Fetch comments from Firestore (real-time updates)
  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Real-Time Comments:", fetchedComments); // Debug log
      setComments(fetchedComments);
    });
    return () => unsubscribe(); // Clean up Firestore listener on unmount
  }, []);

  // Handle new comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    if (user) {
      try {
        const commentData = {
          name: user.displayName || user.email || "Anonymous",
          img: user.photoURL || null,
          text: newComment,
          timestamp: Timestamp.now(),
        };

        // Add new comment to Firestore
        await addDoc(collection(db, "comments"), commentData);
        setNewComment(""); // Clear the input field
      } catch (error) {
        console.error("Error adding comment:", error);
        alert("Failed to submit comment. Check the console for details.");
      }
    } else {
      alert("You must be logged in to leave a comment.");
    }
  };

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1, initialSide: 2 },
      },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="py-10 dark:bg-gray-900 dark:text-white">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-primary p-9">
            What Our Customers are Saying
          </p>
          <h1 className="text-3xl font-bold -mt-7">Reviews</h1>
        </div>

        {/* Testimonial Cards */}
        <div data-aos="zoom-in" className="">
          {comments.length >= 3 ? (
            <Slider {...sliderSettings}>
              {comments.map((comment) => (
                <div
                  className="my-6 relative"
                  key={comment.id || comment.timestamp?.toMillis()}
                >
                  <div className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl bg-primary/40 h-64 overflow-hidden">
                    {/* Decorative Quotation Marks */}
                    <p className="text-black/20 dark:text-gray-300 text-8xl font-serif absolute -top-14 right-5">
                      ,,
                    </p>
                    <div className="mb-4 flex justify-center">
                      {comment.img ? (
                        <img
                          src={comment.img}
                          alt={comment.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500 dark:bg-yellow-800 font-bold">
                          <span className="text-white text-xl font-bold">
                            {comment?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-4 items-center text-center">
                      <p className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden line-clamp-3 break-words">
                        {comment.text}
                      </p>
                      <h1 className="text-lg font-bold text-black/80 dark:text-white">
                        {comment.name}
                      </h1>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {comments.map((comment) => (
                <div
                  className="my-6 relative shadow-lg py-8 px-6 mx-4 rounded-xl bg-primary/40 h-64 overflow-hidden"
                  key={comment.id || comment.timestamp?.toMillis()}
                >
                  {/* Decorative Quotation Marks */}
                  <p className="text-black/20 dark:text-gray-300 text-8xl font-serif absolute -top-14 right-5">
                    ,,
                  </p>
                  <div className="mb-4 flex justify-center">
                    {comment.img ? (
                      <img
                        src={comment.img}
                        alt={comment.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500 dark:bg-yellow-800 font-bold">
                        <span className="text-white text-xl font-bold">
                          {comment?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 items-center text-center">
                    <p className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden line-clamp-3 break-words">
                      {comment.text}
                    </p>
                    <h1 className="text-lg font-bold text-black/80 dark:text-white">
                      {comment.name}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Form */}
        {user && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Leave a Comment</h2>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-yellow-700"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonial;
