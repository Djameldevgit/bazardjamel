// src/components/Breadcrumb/Breadcrumb.jsx
import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BreadcrumbNav = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb className="mb-3">
      {items.map((item, index) => (
        <Breadcrumb.Item
          key={index}
          linkAs={Link}
          linkProps={{ to: item.path }}
          active={index === items.length - 1}
        >
          {index === items.length - 1 ? (
            <strong>{item.label}</strong>
          ) : (
            item.label
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbNav;