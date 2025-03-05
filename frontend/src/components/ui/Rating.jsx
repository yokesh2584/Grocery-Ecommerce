import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

const Rating = ({ value, text, color = "#f8e825" }) => {
  return (
    <div className="rating d-flex align-items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {value >= star ? (
            <FaStar style={{ color }} />
          ) : value >= star - 0.5 ? (
            <FaStarHalfAlt style={{ color }} />
          ) : (
            <FaRegStar style={{ color }} />
          )}
        </span>
      ))}
      {text && <span className="ms-2">{text}</span>}
    </div>
  )
}

export default Rating

