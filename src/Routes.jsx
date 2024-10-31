import { Routes as ReactRoutes, Route } from 'react-router-dom';
import Poster from './pages/poster';
import SqlManager from './pages/sql-manager';

export const Routes = () => {
    return (
        <ReactRoutes>
                <Route path="/" />
                <Route path="/poster" element={<Poster />}/>
                <Route path="/sql" element={<SqlManager />}/>
        </ReactRoutes>
    );
}