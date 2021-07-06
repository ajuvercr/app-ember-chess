import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
module('Integration | Component | star-rating', function (hooks) {
  setupRenderingTest(hooks);

  test('Renders the full and empty stars correctly', async function (assert) {
    this.set('rating', 4);
    this.set('updateRating', () => {});

    await render(hbs`
      <StarRating
        @rating={{this.rating}}
        @onUpdate={{this.updateRating}}
      />`);

    assert
      .dom('[data-test-rr="full-star"]')
      .exists({ count: 4 }, 'The right amount of full stars is rendered');
    assert
      .dom('[data-test-rr="empty-star"]')
      .exists({ count: 1 }, 'The right amount of empty stars is rendered');

    this.set('rating', 2);

    assert
      .dom('[data-test-rr="full-star"]')
      .exists(
        { count: 2 },
        'The right amount of full stars is rendered after changing rating'
      );
    assert
      .dom('[data-test-rr="empty-star"]')
      .exists(
        { count: 3 },
        'The right amount of empty stars is rendered after changing rating'
      );
  });

  test('Calls onUpdate with the correct value', async function (assert) {
    let rating = 2;
    this.set('rating', 2);
    this.set('updateRating', (new_rating) => {
      rating = new_rating;
      // assert.step(`Updated to rating: ${rating}`);
    });

    await render(hbs`
      <StarRating
      @rating={{this.rating}}
      @onUpdate={{this.updateRating}}
      />`);

    await click('[data-test-rr="star-rating-button"]:nth-child(4)');

    assert.equal(rating, 4, "Update didn't happen");
    // assert.verifySteps(['Updated to rating: 4']);
  });
});
