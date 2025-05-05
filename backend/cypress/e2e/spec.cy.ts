/// <reference types="cypress" />

describe('Healthcheck', () => {
  it('should return 200 OK from the base route', () => {
    cy.request('/').then((res) => {
      expect(res.status).to.eq(200);
    });
  });
});
