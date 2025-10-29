"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconType } from "react-icons";

export interface AccordionItem {
  id: number;
  title: string;
  Icon: IconType;
  imgSrc: string;
  description: string;
}

export const VerticalAccordion = ({ items }: { items: AccordionItem[] }) => {
  const [open, setOpen] = useState(items[0].id);

  return (
    <section className="vertical-accordion-section">
      <div className="vertical-accordion-container">
        {items.map((item) => (
          <Panel key={item.id} open={open} setOpen={setOpen} item={item} />
        ))}
      </div>
    </section>
  );
};

interface PanelProps {
  open: number;
  setOpen: Dispatch<SetStateAction<number>>;
  item: AccordionItem;
}

const Panel = ({ open, setOpen, item }: PanelProps) => {
  const { id, title, imgSrc, description } = item;
  const isOpen = open === id;

  return (
    <div className="accordion-panel">
      <button className="accordion-button" onClick={() => setOpen(isOpen ? 0 : id)}>
        <div className="accordion-title-group">
          <span className="accordion-title">{title}</span>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`panel-content-${id}`}
            variants={panelVariantsSm}
            initial="closed"
            animate="open"
            exit="closed"
            className="accordion-content-container"
          >
            <img src={imgSrc} alt={title} className="accordion-image" />
            <motion.div
              variants={descriptionVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="accordion-description-wrapper"
            >
              <p>{description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const panelVariantsSm = {
  open: { height: "200px", opacity: 1 },
  closed: { height: "0px", opacity: 0 },
};

const descriptionVariants = {
  open: { opacity: 1, y: "0%", transition: { delay: 0.2 } },
  closed: { opacity: 0, y: "100%" },
};