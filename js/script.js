// index.html

// انتظار تحميل كامل لمحتوى الصفحة (DOM) قبل تشغيل الكود
document.addEventListener('DOMContentLoaded', () => {

    // 1. الحصول على كل صور المنتجات في صفحة المعرض
    //    نفترض أن كل صورة منتج موجودة داخل العنصر اللي له كلاس 'product-item'
    const productImages = document.querySelectorAll('.product-item img');

    // 2. المرور على كل صورة منتج تم العثور عليها
    productImages.forEach(img => {

        // 3. إضافة مستمع حدث (event listener) لحدث 'click' لكل صورة
        img.addEventListener('click', (event) => {

            // 4. عند الضغط على الصورة، نقوم بتخزين العنصر الذي تم الضغط عليه (وهو الصورة نفسها)
            const selectedImage = event.target;

            // 5. استخراج البيانات من الـ data attributes الخاصة بعنصر الصورة
            //    نستخدم dataset للوصول لهذه البيانات (مثل data-id, data-title, إلخ)
            const productId = selectedImage.dataset.id;
            const imageUrl = selectedImage.src; // مسار الصورة الحالية
            const productTitle = selectedImage.dataset.title;
            const productDescription = selectedImage.dataset.description;
            const productPrice = selectedImage.dataset.price;
            const productSize = selectedImage.dataset.size;
            const productColor = selectedImage.dataset.color; // اللون الأساسي للصورة اللي انضغط عليها
            const productType = selectedImage.dataset.type;
            const productCode = selectedImage.dataset.code;
            const productColors = selectedImage.dataset.colors; // بيانات الألوان المتوفرة (عادةً تكون بصيغة JSON string)

            // 6. إنشاء كائن URLSearchParams لتسهيل بناء الـ Query Parameters في الـ URL
            const params = new URLSearchParams();

            // 7. إضافة كل معلومة كـ Query Parameter في الـ URL
            //    نستخدم encodeURIComponent() لضمان أن الأحرف الخاصة (مثل المسافات، /، العربية) لا تفسد الـ URL
            params.append('id', productId);
            params.append('img', encodeURIComponent(imageUrl));
            params.append('title', encodeURIComponent(productTitle));
            params.append('desc', encodeURIComponent(productDescription));
            params.append('price', encodeURIComponent(productPrice));
            params.append('size', encodeURIComponent(productSize));
            params.append('color', encodeURIComponent(productColor)); // نمرر اللون الأساسي للصورة المختارة
            params.append('type', encodeURIComponent(productType));
            params.append('code', encodeURIComponent(productCode));
            
            // 8. إضافة بيانات الألوان المتوفرة فقط إذا كانت موجودة
            if (productColors) {
                params.append('colors', encodeURIComponent(productColors));
            }
                   
            // 9. إعادة توجيه المستخدم إلى صفحة تفاصيل المنتج (product-details.html)
            //    مع تمرير كل البيانات التي جمعناها كـ Query Parameters في الـ URL
            //    toString() تحول كائن URLSearchParams إلى صيغة string قابلة للاستخدام في الـ URL
            window.location.href = `product-details.html?${params.toString()}`;
        });
    });
});

////////////////////////////////////////////////////////////////////////////////
// product-details.html

// انتظار تحميل كامل لمحتوى الصفحة (DOM) قبل تشغيل الكود
document.addEventListener('DOMContentLoaded', () => {

    // 1. الحصول على كائن URLSearchParams من الـ URL الحالي للصفحة
    //    هذا الكائن يساعدنا في قراءة الـ Query Parameters (المعلومات اللي بعد علامة الاستفهام '؟' في الـ URL)
    const params = new URLSearchParams(window.location.search);

    // 2. استخراج كل البيانات التي تم تمريرها كـ Query Parameters
    //    نستخدم params.get('parameterName') للحصول على قيمة كل Parameter
    //    نستخدم decodeURIComponent() لفك ترميز البيانات التي تم ترميزها سابقاً (مثل المسافات والأحرف العربية)
    //    نستخدم || 'default_value' لتوفير قيمة افتراضية في حال لم يتم العثور على Parameter
    const productId = params.get('id');
    const imageUrl = decodeURIComponent(params.get('img') || ''); // صورة المنتج الأساسية
    const productTitle = decodeURIComponent(params.get('title') || 'منتج غير موجود');
    const productDescription = decodeURIComponent(params.get('desc') || 'التفاصيل غير متوفرة لهذا المنتج.');
    const productPrice = decodeURIComponent(params.get('price') || 'غير متاح');
    const productSize = decodeURIComponent(params.get('size') || 'غير معروف');
    const productColor = decodeURIComponent(params.get('color') || 'غير معروف'); // اللون الأساسي اللي كان مع الصورة الأصلية
    const productType = decodeURIComponent(params.get('type') || 'غير معروف');
    const productCode = decodeURIComponent(params.get('code') || 'غير معروف');

    // 3. استخراج بيانات الألوان المتوفرة (اللي تم تمريرها كـ JSON string)
    const colorsJson = params.get('colors');
    let productColors = []; // مصفوفة فارغة لتخزين تفاصيل الألوان
    if (colorsJson) { // نتأكد أن Parameter الألوان موجود
        try {
            // محاولة فك ترميز وتحويل الـ JSON string إلى مصفوفة JavaScript
            productColors = JSON.parse(decodeURIComponent(colorsJson));
        } catch (e) {
            // في حال فشل التحويل (مثلاً إذا كانت الـ JSON string غير صحيحة)
            console.error("خطأ في تحليل بيانات الألوان:", e);
        }
    }

    // 4. الحصول على العناصر في صفحة product-details.html التي سنعرض فيها البيانات
    //    نفترض أن هذه العناصر موجودة ولها الـ IDs التالية:
    const pageTitleElement = document.getElementById('page-title'); // لعنوان التبويبة (Title tag)
    const imgElement = document.getElementById('product-detail-image'); // لعنصر الصورة الرئيسية للمنتج
    const titleElement = document.getElementById('product-detail-title'); // لعنوان المنتج
    const descElement = document.getElementById('product-detail-description'); // لوصف المنتج
    const priceElement = document.getElementById('product-detail-price'); // لسعر المنتج
    const sizeElement = document.getElementById('product-detail-size'); // لحجم المنتج
    const colorElement = document.getElementById('product-detail-color'); // للون الأساسي للمنتج
    const typeElement = document.getElementById('product-detail-type'); // لنوع المنتج
    const codeElement = document.getElementById('product-detail-code'); // لرمز المنتج
    const colorsHeading = document.getElementById('colors-heading'); // لعنوان قسم الألوان
    const colorOptionsContainer = document.getElementById('color-options-container'); // للعنصر الحاوي لخيارات الألوان

    // 5. تحديث محتوى الصفحة بالبيانات المستخرجة

    // تحديث عنوان التبويبة
    if (pageTitleElement) pageTitleElement.textContent = productTitle;
    
    // تحديث الصورة الرئيسية للمنتج
    if (imgElement && imageUrl) { // إذا كان عنصر الصورة موجود ومسار الصورة موجود
        imgElement.src = imageUrl; // تعيين مصدر الصورة
        imgElement.alt = productTitle; // تعيين نص بديل للصورة (مهم للـ accessibility)
    } else if (imgElement) { // إذا كان عنصر الصورة موجود ولكن مسار الصورة غير موجود
        imgElement.src = 'images/1.jpg'; // استخدام صورة افتراضية
        imgElement.alt = 'صورة غير متوفرة';
    }

    // تحديث باقي التفاصيل النصية
    if (titleElement) titleElement.textContent = productTitle;
    if(descElement) descElement.textContent = productDescription;
    if (priceElement) priceElement.textContent = `${productPrice} ل.س`; // إضافة العملة
    if (sizeElement) sizeElement.textContent = productSize;
    if (colorElement) colorElement.textContent = productColor;
    if (typeElement) typeElement.textContent = productType;
    if (codeElement) codeElement.textContent = productCode ; 

    // 6. بناء وعرض خيارات الألوان المتوفرة
    //    شرط: productColors.length >= 1 (يعني أن هناك لون واحد على الأقل في المصفوفة)
    if (productColors.length >= 1) {
        colorsHeading.textContent = "الألوان المتوفرة :"; // تحديث عنوان قسم الألوان
        colorOptionsContainer.innerHTML = ''; // تفريغ أي محتوى سابق (مثل نصوص افتراضية)

        // المرور على كل لون في مصفوفة productColors
        productColors.forEach(colorOption => {
            // بناء كود HTML لكل خيار لون باستخدام Template Literals
            // ملاحظة: هذه الطريقة بسيطة لكنها قد تكون أقل كفاءة للمرور على عدد كبير من العناصر
            // ولن تسمح بإضافة Event Listeners بسهولة مباشرة هنا (كما تم في التحديث السابق)
            const colorDiv = `
                <div class="color-photo">
                    <div class="image">
                            <img src="${colorOption.image}" class="image1" alt ="${colorOption.name}-كنبة">
                    </div>
                    <h2 class="color">${colorOption.name}</h2>
                </div>
            `; 
            // إضافة كود HTML الخاص باللون الحالي إلى الحاوية
            colorOptionsContainer.innerHTML += colorDiv;           
        });
    } else { // إذا لم يتم العثور على أي لون (المصفوفة فارغة)
        colorsHeading.textContent = "متوفرة باللون المعروض فقط"; // تغيير العنوان
        colorOptionsContainer.innerHTML = ''; // التأكد من أن الحاوية فارغة
    }

    // 7. التحقق من وجود معرّف المنتج (productId)
    //    إذا لم يتم العثور عليه، فهذا يعني أن هناك مشكلة في الرابط أو البيانات الممررة
    if (!productId) {
        console.warn('لم يتم العثور على معرّف المنتج في الرابط.');
    }
});

// /////////////////////////////////////////////////////
// buy.html

// انتظار تحميل كامل لمحتوى الصفحة (DOM) قبل تشغيل الكود
document.addEventListener('DOMContentLoaded', () => {

    // 1. الحصول على عناصر واجهة المستخدم (UI Elements) من الـ HTML
    //    تم الحفاظ على أسماء المتغيرات كما هي.
    const productColorSelect = document.getElementById('color-options'); // عنصر الـ select الخاص باختيار اللون
    const numberOfProductsInput = document.getElementById('number-of-products'); // حقل إدخال عدد المنتجات
    const paymentMethodSelect = document.getElementById('paymentMethodSelect'); // عنصر الـ select الخاص بطريقة الدفع (سيتم استخدامه لاحقاً)
    const addressInput = document.getElementById('addressInput'); // حقل إدخال العنوان
    const emailInput = document.getElementById('emailInput'); // حقل إدخال البريد الإلكتروني
    const submitButton = document.querySelector('input[type="submit"]'); // زر الإرسال
    const offcanvasP = document.getElementById('offcanvas-p'); // عنصر الـ p داخل الـ Offcanvas لعرض الرسائل

    // 2. إضافة مستمع حدث (Event Listener) لزر الإرسال عند النقر عليه
    submitButton.addEventListener('click', (event) => {        
        
        // 3. التحقق من صحة المدخلات المطلوبة (Required Inputs)
        //    checkValidity() تتحقق من الحقول المطلوبة (required) وأن قيمها ضمن الحدود المسموحة (min, max).
        //    إذا كانت المدخلات غير صالحة، نتوقف هنا.
        if (!numberOfProductsInput.checkValidity() || !emailInput.checkValidity()) {
            offcanvasP.innerHTML = `
            <p class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <strong>خطأ:</strong> يرجى ملئ كافة الحقول
            </p>`
            return; // إيقاف تنفيذ باقي الكود في هذه الدالة.
        }

        // 4. الحصول على قيمة اللون المختار والنص الظاهر له
        const selectedColorValue = productColorSelect.value; // قيمة الـ 'value' attribute للعنصر المختار.
        // الحصول على النص الظاهر للعنصر المختار (للعرض للمستخدم).
        const selectedColorText = productColorSelect.options[productColorSelect.selectedIndex].textContent; 

        // 5. الحصول على قيمة عدد المنتجات المدخلة.
        const numberOfProducts = numberOfProductsInput.value;

        // 6. الحصول على قيمة العنوان المدخل.
        const address = addressInput.value;
        
        // 7. التحقق من اختيار اللون:
        //    إذا كان اللون المختار غير فارغ (يعني أن المستخدم اختار لوناً وليس الخيار الافتراضي أو لم يختر شيئاً).
        if (selectedColorValue !== "") {
            // 8. في حال تم اختيار لون، نقوم ببناء محتوى رسالة التأكيد.
            //    (نفترض أن paymentMethodSelect لا يزال فيه ميزة 'multiple' أو أنه اختيار واحد)
            //    للحصول على جميع القيم المختارة في select متعدد:
            const selectedPaymentMethods = Array.from(paymentMethodSelect.selectedOptions).map(option => option.textContent);

            offcanvasP.innerHTML = `
            <p><strong>تم إضافة منتجك إلى سلة المشتريات بنجاح!</strong></p>
            <ul class="offcanvas-menu">
                <li><strong>اللون المختار:</strong> ${selectedColorText} (${selectedColorValue})</li>
                <li><strong>عدد المنتجات:</strong> ${numberOfProducts}</li>
                <li><strong>طريقة الدفع:</strong> ${selectedPaymentMethods}</li>
                <li><strong>عنوان الشحن:</strong> ${address || 'لم يتم إدخال عنوان'}</li>
            </ul>
            <p>سنقوم بمعالجة طلبك قريباً</p>
            `;
            // لا يتم إظهار الـ Offcanvas تلقائياً هنا، لكن يمكن ربطه بالـ
            // submit button عبر Bootstrap attributes.
            // إذا أردتِ التحكم به يدوياً:
            // const offcanvasElement = new bootstrap.Offcanvas(document.getElementById('staticBackdrop'));
            // offcanvasElement.show();

        } else {
            // 9. في حال لم يتم اختيار لون (selectedColorValue فارغ)، نعرض رسالة خطأ للمستخدم.
            //    سيتم إظهار هذه الرسالة داخل نفس العنصر 'offcanvas-p'، مما يتطلب تنظيم الـ HTML قليلاً
            //    أو عرضها في عنصر منفصل. لتبسيط الكود، سنعرضها هنا.
            offcanvasP.innerHTML = `
            <p class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <strong>خطأ:</strong> يرجى اختيار عدد المنتجات و لون للمنتج قبل إضافته للسلة
            </p>
            `;
            // منع إرسال النموذج أو إظهار التأكيد في هذه الحالة.
            event.preventDefault(); // منع السلوك الافتراضي للزر (وهو الإرسال أو تفعيل الـ Offcanvas)
            // إذا كان الزر يستخدم data-bs-toggle لتفعيل الـ Offcanvas، فقد لا تحتاجين لمنع السلوك الافتراضي هنا
            // لأنك تريدين أن يظهر الـ Offcanvas ليحتوي على رسالة الخطأ.
            // في هذه الحالة، يجب أن يكون الـ HTML مهيأ ليظهر رسالة الخطأ بدلاً من رسالة التأكيد.
        }
    });
});
// ///////////////////////////////////////////////
// signup.html

document.addEventListener('DOMContentLoaded', function () {
    const formRegister = document.querySelector(".form-registration");

    formRegister.addEventListener('submit', showMessage);

    function showMessage (event) {
        event.preventDefault();

        const name = document.getElementById("name-signup").value.trim();
        const email = document.getElementById("email-signup").value.trim();
        const password = document.getElementById("password-signup").value;
        const confirmPassword = document.getElementById("confirmpassword").value;
        const errorMessage = document.getElementById("error-message");
    
        errorMessage.textContent = "";
    
        if (!name || !email || !password || !confirmPassword) {
            errorMessage.textContent = "all fields are required !";
            return;
          }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorMessage.textContent = "email is not true !";
                return;
            }
        
        if (password !== confirmPassword) {
            errorMessage.textContent = "password and confirm password are not equal !";
            return;
        }
            
        alert("you've successfully sent you information !");
    };
    
});

