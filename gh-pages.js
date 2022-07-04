var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/Pierniki/bubbles.git', // Update to point to your repository  
        user: {
            name: 'Marcin Szczepaniak', // update to use your name
            email: 'mszczep4niak@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)