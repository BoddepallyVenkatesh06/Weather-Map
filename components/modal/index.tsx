"use client";
import classNames from "classnames";
import { motion } from "framer-motion";
import {
  ForwardRefRenderFunction,
  PropsWithChildren,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Button from "../button";

export type IModalType = {
  open: () => void;
  close: () => void;
};

type IModal = "post" | "default";
type Props = {
  type?: IModal;
  textObj: { text: string; message?: string };
  modalClassName?: string;
} & PropsWithChildren;

const Modal: ForwardRefRenderFunction<IModalType, Props> = (
  { children, type = "default", textObj: { text, message }, modalClassName },
  ref
) => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCancel = () => {
    setOpen(false);
  };
  const openModal = () => {
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({
    close() {
      handleCancel();
    },
    open() {
      openModal();
    },
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef?.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const returnModal = () => {
    switch (type) {
      case "default":
        return (
          <motion.div
            className="absolute left-0 w-full h-full overflow-hidden flex justify-center top-0 items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0.6, 0.85, 1] }}
            transition={{
              duration: 1.5,
            }}
          >
            <div
              className="w-[90%] md:w-[500px] bg-dark absolute"
              // ref={modalRef}
            >
              <div>
                <Button
                  onClick={handleCancel}
                  className={classNames(modalClassName)}
                >
                  {text}
                </Button>
              </div>
              {children}
            </div>
          </motion.div>
        );
      case "post":
        return (
          <div className="mt-4 fixed top-0 left-0 flex z-50  w-full text-white items-center justify-center">
            <motion.div
              className="w-[90%] lg:w-1/2 bg-dark flex justify-between items-center p-5 "
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 0.6, 0.85, 1] }}
              transition={{
                duration: 1.5,
              }}
            >
              <p className="text-sm">{message}</p>
              <p
                className="cursor-pointer text-green-500"
                onClick={handleCancel}
              >
                {text}
              </p>
            </motion.div>
          </div>
        );

      default:
        break;
    }
  };

  return (
    <>
      {open && (
        <>
          <motion.div
            className="text-white fixed top-0 left-0 bg-gray-900 h-screen w-full z-40 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0.6, 0.85] }}
            transition={{ duration: 1.5 }}
            onClick={handleCancel}
          />
          {returnModal()}
        </>
      )}
    </>
  );
};

export default forwardRef(Modal);
