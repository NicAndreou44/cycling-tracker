/// <reference types="cypress" />

describe('Rides API', () => {
  let token: string;
  let createdRideId: number;
  
  before(() => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: {
        email: 'test-user@example.com', 
        password: 'password123',
      },
      failOnStatusCode: false 
    }).then((response) => {
      
      if (response.status !== 200) {
        cy.log(`Auth failed with status: ${response.status}`);
        cy.log(`Response body: ${JSON.stringify(response.body)}`);
      }
      
      expect(response.status).to.eq(200);
      token = response.body.token;
      expect(token).to.exist;
    });
  });
  
  it('should create a new ride', () => {
    cy.request({
      method: 'POST',
      url: '/api/rides',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        name: 'Morning Ride',
        distanceKm: 25,
        duration_minutes: 60,
        type: 'Cycling',
        notes: 'Created from Cypress',
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      createdRideId = response.body.id;
    });
  });
  
  it('should fetch all rides', () => {
    cy.request({
      method: 'GET',
      url: '/api/rides',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('rides');
      expect(response.body.rides).to.be.an('array');
      expect(response.body.rides.length).to.be.greaterThan(0);
      const ride = response.body.rides.find((r: any) => r.id === createdRideId);
      expect(ride).to.exist;
    });
  });
  
  it('should delete the created ride', () => {
    if (!createdRideId) {
      cy.log('Skipping delete test because ride creation failed');
      return;
    }
    cy.request({
      method: 'DELETE',
      url: `/api/rides/${createdRideId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });
});