import React from 'react';
import { Row, Col } from 'react-bootstrap';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import PerformanceChart from './PerformanceChart';

const Overview = () => {
  return (
    <div className="overview">
      <Row className="g-4">
        <Col xs={12}>
          <StatsCards />
        </Col>
        
        <Col lg={8}>
          <PerformanceChart />
        </Col>
        
        <Col lg={4}>
          <RecentActivity />
        </Col>
      </Row>
    </div>
  );
};

export default Overview;