import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

function CategoryItem({ category, depth = 0 }) {
  const hasChildren = category.children && category.children.length > 0;
  const [expanded, setExpanded] = useState(depth === 0);

  const paddingLeft = depth === 0 ? 'pl-0' : depth === 1 ? 'pl-4' : 'pl-8';

  return (
    <li>
      <div className={`flex items-center gap-1 ${paddingLeft}`}>
        <NavLink
          to={`/categories/${category.slug || category.id}`}
          className={({ isActive }) =>
            `flex-1 text-sm py-1.5 rounded transition-colors ${
              isActive
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-600'
            }`
          }
        >
          {category.name}
        </NavLink>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${category.name}`}
          >
            <img
              src={expanded ? chevronDownIcon : chevronRightIcon}
              alt=""
              className="w-4 h-4"
            />
          </button>
        )}
      </div>
      {hasChildren && expanded && (
        <ul className="mt-0.5 space-y-0.5">
          {category.children.map((child) => (
            <CategoryItem key={child.id} category={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function CategoryNav({ categories = [], title = 'Categories' }) {
  if (!categories || categories.length === 0) return null;

  return (
    <nav aria-label={title}>
      {title && (
        <h2 className="text-base font-bold text-gray-900 mb-3">{title}</h2>
      )}
      <ul className="space-y-1">
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} depth={0} />
        ))}
      </ul>
    </nav>
  );
}
