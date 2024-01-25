import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeReview } from "../../store/reviewReducer";
import './DeleteReview.css';

const DeleteReviewModal = ({ review }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = e => {
        e.preventDefault();
        return dispatch(removeReview(review.id))
            .then(closeModal)
    }

    return (
        <div className="delete">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this review?</p>
            <div className="confirm-delete">
                <button className="yes-delete" onClick={handleDelete}>Yes (Delete Review)</button>
                <button className="no-delete" onClick={closeModal}>No (Keep Review)</button>
            </div>
        </div>
    )
};

export default DeleteReviewModal;
