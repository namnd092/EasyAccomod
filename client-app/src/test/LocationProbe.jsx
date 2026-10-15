import React from 'react';
import { useLocation } from 'react-router-dom';

// Shows the URL query the page under test ended up with.
export function LocationProbe() {
    return <output data-testid="query">{useLocation().search}</output>;
}
