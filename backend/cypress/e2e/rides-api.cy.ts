describe('Rides API', () => {
  let token: string;
  let createdRideId: number;

 
  before(() => {
    cy.request('POST', '/api/auth/login', {
      email: 'admin@example.com',
      password: 'password123',
    }).then((res) => {
      expect(res.status).to.eq(200);
      token = res.body.token;
      expect(token, 'Token from login').to.exist;
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
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property('id');
      createdRideId = res.body.id;
      cy.log(`Created ride ID: ${createdRideId}`);
    });
  });

  
  it('should fetch all rides', () => {
    cy.request({
      method: 'GET',
      url: '/api/rides',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);

      const ride = res.body.find((r) => r.id === createdRideId);
      expect(ride, 'Created ride should exist in list').to.exist;
    });
  });

 
  it('should delete the created ride', () => {
    cy.log(`Attempting to delete ride with ID: ${createdRideId}`);

    cy.request({
      method: 'DELETE',
      url: `/api/rides/${createdRideId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('id', createdRideId);
      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('distanceKm');
    });
  });
});
