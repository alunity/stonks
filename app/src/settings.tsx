import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";

interface iProps {
  open: boolean;
  setOpen: Function;
}

function Settings(props: iProps) {
  let [modal, setModal] = useState(null);
  let modalElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalElement.current !== null) {
      // @ts-ignore
      setModal(new Modal(modalElement.current, { backdrop: "static" }));
    }
  }, [modalElement]);

  useEffect(() => {
    if (modal !== undefined && props.open) {
      // @ts-ignore
      modal.show();
    }
  }, [props.open]);

  return (
    <div
      data-bs-theme="dark"
      className="modal"
      ref={modalElement}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered text-white">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Settings</h5>
          </div>
          <div className="modal-body">
            <div>
              <h5>Reset</h5>
              <p className="float-left text-danger">
                Warning: This clears your portfolio and restores your cash to
                $1000.
              </p>
              <button
                onClick={() => {
                  localStorage.clear();
                  location.reload();
                }}
                className="btn btn-danger"
              >
                Reset
              </button>
            </div>
            <br></br>
            <div>
              <h5>Import and Export data</h5>
              <button
                className="btn btn-warning"
                onClick={() => {
                  const data = prompt("Enter your save data:");
                  localStorage.data = data;
                  location.reload();
                }}
              >
                Import
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  navigator.clipboard.writeText(localStorage.data);
                  alert("Data has been copied to clipboard");
                }}
              >
                Export
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => props.setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
