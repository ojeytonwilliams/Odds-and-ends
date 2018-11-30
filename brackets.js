// What I'm trying to do is write an algorithm that creates all possible
// configurations of brackets that could be put around n operands.

// So, if n were 2 it would return [0,0] (or equivalent) to indicate that there are no
// brackets around either operand (since putting brackets around the entire
// expression doesn't change anything)

// If n were 3 we'd get
// [1,-1,0] and [0,1,-1] with m being "open m brackets" and -m being "close m brackets", so: (ab)c and a(bc)

// THE APPROACH!
// High level:
// I'm considering a recursive algorithm that tries to put in all the brackets
// of size n and then recurses into newly created brackets and the remaining
// parts of the array.  For a function bracketise(arr, n) it would call
// bracketise(subArr, n-1) on each of the smaller array sections.

// Each iteration:
// bracketise should use the smaller of length and n as its bracket size, k.
// If that's larger than 1 it should start from the left and try to put a
// k-bracket in.  This can create two groups, "has a k-bracket starting at 0"
// and "doesn't".  Each group can be recursed on.  The first case calling
// bracketise(arrMinusFirstk, k) and the second calling
// bracketise(arrTail, k) along with recursion into any k-brackets that have
// been created!

// length is the number of operands, so the length of the bracket array is
// length + 1
function bracketise(length, n) {
  let max = Math.min(length, n);
  if (max <= 1) return [empty(length + 1)];

  let brackets = [];
  for (let k = max; k > 1; k--) {
    for (let i = 0; i <= length - k; i++) {
      brackets = brackets.concat(openBracket(length, i, k));
    }
  }

  brackets = brackets.concat([empty(length + 1)]);
  return brackets;
}

// creates a k-bracket starting at i, recurses into the newly created bracket
// and the remainder of xs
function openBracket(length, i, k) {
//  console.log("openBracket called with", length, i, k);
  if (i < 0 || i > length || i + k > length) {
    throw new Error("openBracket called with invalid arguments, array out of bounds");
  }
  let head = i;
  let middle = k;
  let tail = length - i - k;

  // we don't put brackets to the left of the 'main' one, to avoid generating
  // the same configuration twice
  let headBrackets = [empty(i + 1)];
  // k is decremented for the middle one, because we're going into a bracket
  let middleBrackets = bracketise(middle, k - 1);
  for (let i in middleBrackets) {
    let end = middleBrackets[i].length - 1;
    middleBrackets[i][0] = "(" + middleBrackets[i][0];
    middleBrackets[i][end] = middleBrackets[i][end] + ")";
  }

  let tailBrackets = bracketise(tail, tail);
  let merged = merge(merge(headBrackets, middleBrackets), tailBrackets);
//  console.log(merged);
//  console.log("end of openBracket", length, i, k);
  return merged;
}

// Takes two arrays of arrays (where the sub arrays are length n and m) and
// creates an array of arrays (where the sub arrays are length n + m)
/*function merge(xs, ys) {
  let out = [];
  for(let i in xs) {
    for(let j in ys) {
      out.push(xs[i].concat(ys[j]));
    }
  }
  return out;
} */

function merge(xs, ys) {
  let out = [];
  for (let i in xs) {
    for (let j in ys) {
      // the edges combine to a single entry
      let temp = xs[i].slice(0, -1);
      temp.push(xs[i][xs[i].length - 1] + ys[j][0]);
      // then we add the rest
      out.push(temp.concat(ys[j].slice(1)));
    }
  }
  return out;
}


function empty(n) {
  let out = [];
  for (let i = 0; i < n; i++) {
    out.push("");
  }
  return out;
}

//console.log(merge([[1],[2]],[[2,3],[4,5]])); // [ [ 1, 2, 3 ], [ 1, 4, 5 ], [ 2, 2, 3 ], [ 2, 4, 5 ] ] OLD MERGE

//console.log(merge([['(','',')']], [['(','',')']]));

//console.log(bracketise(2,2)); // [['(','', ')']];

//console.log(bracketise(3,2)); // [['(','', ')',''], ['','(','', ')']];
//console.log();
//console.log(bracketise(4, 3));

//console.log(bracketise(5,4));
//console.log(bracketise(6,5).length);

// So, looks like I've nailed it!  The following sequence spits out the right
// number of configurations (turns out they're super-catalan numbers and
// appear on oeis) and, for the ones I can check myself, they work.  11 is
// already pretty slow because, well, there's lot of possibilities and my
// approach has not been optimized at all.
/*for(let i = 3; i < 12; i++) {
  let soln = bracketise(i, i-1);
  // for(let j in soln){
  //   console.log(soln[j]);
  // }
  console.log(soln.length);
}*/
