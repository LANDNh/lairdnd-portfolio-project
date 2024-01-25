import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { removeSpot } from "../../store/spotReducer";
import './DeleteSpot.css';

const DeleteSpotModal = ({ spot }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = e => {
        e.preventDefault();
        return dispatch(removeSpot(spot.id))
            .then(closeModal)
    }

    return (
        <div className="delete">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot?</p>
            <div className="confirm-delete">
                <button className="yes-delete" onClick={handleDelete}>Yes (Delete Spot)</button>
                <button className="no-delete" onClick={closeModal}>No (Keep Spot)</button>
            </div>
        </div>
    )
};

export default DeleteSpotModal;
