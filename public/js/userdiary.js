// idhr hum client side pe kaam kr rahai han server side pe nhi kr rahai han

const deletePost = (btn) =>{ // delete post function hai jo onclick pe chale ga
  const postId = btn.parentNode.parentNode.querySelector('[name=postID]').value; // parentNode ka mtlb jo button ke bhr hai usko access krna
  const csrf = btn.parentNode.parentNode.querySelector('[name=_csrf]').value

  const postElement = btn.closest('.flip-box'); // ap kes chese ko use yah get krna chate hai jese kese cheses ko select krna
  console.log(postElement);
// browser yeh method support krta hai for sending hhtp request
  fetch('/post/' + postId, {  // aik hota hai fect data ko fetch krna yah hum data de rahai han
    method: 'DELETE',
    headers: {
      //csrf ka faida yeh hai ke yeh srf body or param me nhi blke headers me bhi pakge include hota hai jese yaha pr
      'csrf-token': csrf  // header me hum csrf token de rahai ahn
    }
  })
    .then(result => {
      console.log(result);
      return result.json();
    })
    .then(data => {
      console.log(data);
    //  postElement.remove();  idhr yeh flipbox ko removekr raha hai but remove modern browser pe chelte han toh iske leye hum kuch or use kare ge jo her chese pe chale
    postElement.parentNode.removeChild(postElement);
    })
    .catch(err => {
      console.log(err);
    });
};
