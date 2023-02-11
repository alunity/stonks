import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import iPortfolio from "./iPortfolio";

interface iProps {
  portfolio: iPortfolio;
}

function Startup(props: iProps) {
  const modalElement = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    if (
      modalElement.current !== null &&
      Object.keys(props.portfolio).length === 0 &&
      !opened.current
    ) {
      let modal = new Modal(modalElement.current, { backdrop: "static" });
      modal.show();
      opened.current = true;
    }
  }, [modalElement]);

  return (
    <div
      data-bs-theme="dark"
      className="modal"
      ref={modalElement}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Welcome to Stonks</h5>
          </div>
          <div className="modal-body text-white">
            <strong>Stonks </strong>is a small stock market simulator with a
            focus on long term investments.
            <br></br>
            To start, you have been given a <strong>$1000 </strong>to invest
            however you like. Try and make the <strong>most </strong>money you
            can!
            <br></br>
            To find what <strong>symbols </strong>to invest in check out{" "}
            <a target="_blank" href="https://uk.finance.yahoo.com/">
              Yahoo Finance
            </a>
            .
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Okay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Startup;
